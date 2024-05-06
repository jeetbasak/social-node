const express = require("express");
const Joi=require("joi");

//import User and Follow models and middleware
const UserMod=require("../models/UserModel");
const FollowModel=require("../models/FollowModel");
const AuthMiddleware=require("../middleware/AuthMiddleware");

const AppRoutes=express.Router();




// follow create
AppRoutes.post("/create",AuthMiddleware, async (req,res)=>{
    const rules = Joi.object({
        followto_user_id:Joi.required(),
    });

    const validationError = rules.validate(req.body);
    const { value, error } = validationError;
    const valid = error == null;
    if (!valid) {
        return res.status(400).json({ code: 500, 'message': validationError.error.details[0].message });
    }

    const {followto_user_id}=req.body;

    //check userid exist or not
    const chk=await UserMod.findOne({
        where:{
            id: followto_user_id
        }
    });

    if(!chk){
        return res.status(400).json({ 'message': "User Id not find to follow", code: 500 });
    }

    const followins= await FollowModel.create({
        "followto_user_id":followto_user_id,
        "followby_user_id":req.user.id
    });
     res.status(201).json({ "follow": followins, "message": "user follow Successfully" , code: 200});

});












//dislike
AppRoutes.post('/delete', AuthMiddleware, async (req, res) => {
    try {
        // validation rule created
        const rules = Joi.object({
            followto_user_id:Joi.required(),
        });

        const validationError = rules.validate(req.body);
        const { value, error } = validationError;
        const valid = error == null;
        if (!valid) {
            return res.status(400).json({ 'message': validationError.error.details[0].message ,code: 500});
        }

        const { followto_user_id } = req.body;

        //check that postid exist or not
        const chk= await FollowModel.findOne({
            where:{
                followto_user_id:followto_user_id,
                followby_user_id:req.user.id
            }
        });
        if(!chk){
            return res.status(400).json({ 'message': "follow id not present.",code: 500 });
        }

        const followdlt = await FollowModel.destroy({
            where: {
                followto_user_id: followto_user_id,
                followby_user_id:req.user.id
            }
        });

        res.status(201).json({"message": "unfollowed Successfully",code: 200 });

    } catch (error) {
        res.status(500).json({ message: error.message,code: 500 });
    }
});


module.exports=AppRoutes;
