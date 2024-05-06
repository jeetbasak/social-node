const {DataTypes} = require("sequelize");
const connection= require("../database/dbsetup");

const Follows=connection.define("follows",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    followto_user_id: {
        type: DataTypes.INTEGER,

    },
    followby_user_id: {
        type: DataTypes.INTEGER,

    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports=Follows;