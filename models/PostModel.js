const { DataTypes } = require('sequelize');
const connection = require("../database/dbsetup");

const UserMod=require("./UserModel");

const Posts = connection.define('posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    title: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('A', 'I'),
    }

}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',

});



Posts.hasOne(UserMod,  {
    foreignKey: 'id', //user table key
    sourceKey: 'user_id', //this table key
    as: 'userDetails'
  });

module.exports = Posts;