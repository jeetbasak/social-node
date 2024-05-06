const express = require("express") 
const con = require('../database/dbsetup');
const bcrypt = require("bcrypt") 
const jwt = require('jsonwebtoken'); 
const Joi = require('joi');
const nodemailer = require("nodemailer");
const UserMod = require('../models/UserModel');
const followMod=require("../models/FollowModel")
const { Op } = require('sequelize');
const AuthMiddleware=require("../middleware/AuthMiddleware");

const appRoute = express.Router();











appRoute.post("/register", async (req, res) => {
  try {
    // validation rule created
    const rules = Joi.object({
      name: Joi.required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.required(),
    });

    const validationError = rules.validate(req.body);
    const { value, error } = validationError;
    const valid = error == null;
    if (!valid) {
      return res.status(400).json({ 'message': validationError.error.details[0].message, "code": 500 });
    }


    const isEmailExist = await UserMod.findOne({
      where: {
        email: req.body.email
      }
    })

    if (isEmailExist) {
      return res.status(400).json({ message: 'Email already exist.', "code": 500 });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let imageName = null;
    if (req.files?.image) {
      const image = req.files.image;
      imageName = Date.now() + "-" + image.name;
      console.log(image)
     
      image.mv("public/user/" + imageName, async (err) => {
        if (err) {
          return res.status(500).json({ "message": "Failed", "code": 500 });
        }

        const UserIns = await UserMod.create({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          image: imageName
        });
        return res.status(200).json({ "message": "User inserted successfully", "data": UserIns, "code": 200 });
      })



    } else {
      const UserIns = await UserMod.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        image: imageName
      });

      return res.status(200).json({ "message": "User inserted successfully", "data": UserIns, "code": 200 });
    }


  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      response: 'something is wrong'
    })
  }
});













appRoute.post("/login", async (req, res) => {

  try {
    // validation
    const rules = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password: Joi.required(),
    });

    const validationError = rules.validate(req.body);
    const { value, error } = validationError;
    const valid = error == null;
    if (!valid) {
      return res.json({
        code: 500,
        message: validationError.error.details[0].message
      });
    }


    const user = await UserMod.findOne({
      where: {
        email: req.body.email,
      },

    });
    if (user) {
      const isMatched = await bcrypt.compare(req.body.password, user.password);
      if (isMatched) {
        var Object = {
          name: user.name,
          email: user.email,
          id: user.id
        }
        var token = jwt.sign(Object, "abcdefghijklmnopqrstuvwxyz");

        const userDetails = await UserMod.findOne({
          where: {
            id: user.id,
          },
          attributes: { exclude: ['password'] }

        });


        return res.json({
          access_token: token,
          token_type: 'Bearer',
          userDetails: userDetails,
          code: 200,
          message: 'Succesful login'
        });
      }
    }
    return res.json({
      code: 500,
      message: 'Credentials are wrong'
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      code: 500,
      msg: error,
      response: 'something is wrong'
    })
  }
});












// appRoute.get("/users", AuthMiddleware, async (req, res) => {
//   try {
//     // Fetch all users from the database
//     const users = await UserMod.findAll({
//       where: {
//         id: {
//           [Op.ne]: 1 // Exclude the user with the ID 1
//         }
//       },
//       attributes: { exclude: ['password'] }
//     });


//     res.json(users); // Send the users as JSON response
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ error: 'Internal server error' }); // Send error response
//   }
// });






appRoute.get("/users", AuthMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const users = await UserMod.findAll({
      where: {
        id: {
          [Op.ne]: req.user.id 
        }
      },
      attributes: { exclude: ['password'] }
    });

    const likedUserIds = await followMod.findAll({
      where: {
        followby_user_id: loggedInUserId
      },
      attributes: ['followto_user_id']
    }).then(likes => likes.map(like => like.followto_user_id));

    const usersWithFollowing = users.map(user => ({
      ...user.toJSON(),
      following: likedUserIds.includes(user.id)
    }));

    res.json(usersWithFollowing); 
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});





module.exports = appRoute;