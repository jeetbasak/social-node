const { DataTypes } = require('sequelize');
const connection = require("../database/dbsetup");

const Likes = connection.define("likes", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: DataTypes.INTEGER,

    },
    user_id: {
        type: DataTypes.INTEGER,

    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',

});

module.exports=Likes;