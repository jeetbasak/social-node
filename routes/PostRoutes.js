const express = require("express");
const Joi = require('joi');
const fileUpload = require('express-fileupload');
const { Sequelize } = require('sequelize');
//import model
const PostMod = require("../models/PostModel");
const LikeMod = require("../models/LikeModel");
const UserMod=require("../models/UserModel")

//import middleware
const AuthMiddleware = require("../middleware/AuthMiddleware");

const AppRoute = express.Router();













// Create a new post
AppRoute.post('/create', AuthMiddleware, async (req, res) => {
    try {
        // validation rule created
        const rules = Joi.object({
            title: Joi.required(),
            content: Joi.required(),
        });

        const validationError = rules.validate(req.body);
        const { value, error } = validationError;
        const valid = error == null;
        if (!valid) {
            return res.status(400).json({ code: 500, 'message': validationError.error.details[0].message });
        }

        const { title, content } = req.body;

        let imageName = null;
        if (req.files?.image) {
            const image = req.files.image;
            imageName = Date.now() + "-" + image.name;

            image.mv("public/posts/" + imageName, async (err) => {
                if (err) {
                    return res.status(500).json({ code: 500, "message": "Failed" });
                }
                const status = "A";
                const post = await PostMod.create({
                    title: title,
                    content: content,
                    image: imageName,
                    status: status,
                    user_id: req.user.id,
                });

                res.status(201).json({ "post": post, code: 200, "message": "Post Created Successfully" });
            })
        } else {
            const status = "A";
            const post = await PostMod.create({
                title: title,
                content: content,
                image: imageName,
                status: status,
                user_id: req.user.id,
            });

            res.status(201).json({ "post": post, code: 200, "message": "Post Created Successfully" });

        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});










//list of all posts
AppRoute.get("/list", AuthMiddleware, async (req, res) => {
    try {
    

        // Fetch all posts
        const posts = await PostMod.findAll({
            where:{
                'status': 'A'
            },
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.post_id = posts.id)'), 'like_count']
                ]
            },
            include: [{
                model: UserMod,
                as: 'userDetails'
            }],
            order: [
                ['id', 'DESC'],
            ],

        });
        const userId = req.user.id;


        const userLikes = await LikeMod.findAll({
            where: {
                user_id:userId,
                // postId: postIds
            }
        });

        const likedPostIdsByLoginUser = userLikes.map(like => like.post_id);

        const postsWithUserLikes = posts.map(post => ({
            ...post.toJSON(),
            loginUserLike: likedPostIdsByLoginUser.includes(post.id) 
        }));

        res.status(201).json({ "message": "post fetched", code: 200, "posts": postsWithUserLikes })
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error',code: 500 });
    }
})








module.exports = AppRoute;