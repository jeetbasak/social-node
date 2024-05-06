const express = require('express');
const Joi = require('joi');
//import likes model
const LikeMod = require("../models/LikeModel");
const PostMod=require("../models/PostModel")
const AuthMiddleware = require("../middleware/AuthMiddleware")

const AppRoute = express.Router();





//like
AppRoute.post('/create', AuthMiddleware, async (req, res) => {
    try {
        // validation rule created
        const rules = Joi.object({
            post_id: Joi.required(),
        });

        const validationError = rules.validate(req.body);
        const { value, error } = validationError;
        const valid = error == null;
        if (!valid) {
            return res.status(400).json({code: 500, 'message': validationError.error.details[0].message });
        }

        const { post_id } = req.body;

        //check that postid exist or not
        const chk= await PostMod.findOne({
            where:{
                id:post_id
            }
        });
        if(!chk){
            return res.status(400).json({code: 500, 'message': "post not present." });
        }

        const like = await LikeMod.create({
            post_id: post_id,
            user_id: req.user.id,
        });

        res.status(201).json({ "like": like, code: 200, "message": "post like Successfully" });

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});










//dislike
AppRoute.post('/delete', AuthMiddleware, async (req, res) => {
    try {
        // validation rule created
        const rules = Joi.object({
            post_id:Joi.required(),
        });

        const validationError = rules.validate(req.body);
        const { value, error } = validationError;
        const valid = error == null;
        if (!valid) {
            return res.status(400).json({ code: 500, 'message': validationError.error.details[0].message });
        }

        const { post_id } = req.body;

        //check that postid exist or not
        const chk= await LikeMod.findOne({
            where:{
                post_id:post_id,
                user_id:req.user.id
            }
        });
        if(!chk){
            return res.status(400).json({ code: 500,'message': "like id not present." });
        }

        const likedlt = await LikeMod.destroy({
            where: {
                post_id:post_id,
                user_id:req.user.id
            }
        });

        res.status(201).json({"message": "post dislike Successfully" ,code: 200});

    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});


module.exports = AppRoute;