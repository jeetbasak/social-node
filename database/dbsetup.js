const {Sequelize}=require('sequelize');
const dbcred=require('./dbcred')

const connection = new Sequelize(dbcred.database, dbcred.username, dbcred.password, {
    host: "localhost",
    dialect: 'mysql',
    operatorsAliases: 'false',
    logging: false
});  


module.exports=connection;