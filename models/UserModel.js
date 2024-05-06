const { DataTypes } = require('sequelize');
const sequelize = require('../database/dbsetup');

const Users = sequelize.define('users', {
    name: {
        type: DataTypes.STRING 
    },
    email: {
        type: DataTypes.STRING 
    },
    password: {
        type: DataTypes.STRING 
    },
    image: {
        type: DataTypes.STRING
    },

},
 {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
}); 


// those filed will not show
// Users.addScope('defaultScope', {
//     attributes: { exclude: ['password','updated_at','created_at'] }
// }, { override: true });



module.exports = Users;
