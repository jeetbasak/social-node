//import all install packages
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const fileUpload=require('express-fileupload');



//import all routes
const UserRoute = require('./routes/UserRoutes'); 
const PostRoute=require("./routes/PostRoutes");
const LikeRoute=require("./routes/LikeRoutes");
const FollowRoute=require("./routes/FollowRoutes")


//initialize express
const app=express();


//middleware using app.use()
app.use(express.static('public'))
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json()); 


app.get("/",(req,res)=>{
    res.send({
        msg:"hello world"
    });
});





// use prefix of all routes
app.use("/backend/user", UserRoute);
app.use("/backend/posts",PostRoute);
app.use("/backend/likes",LikeRoute);
app.use("/backend/follows",FollowRoute);


app.listen(5000,()=>{
    console.log('Server listening on:5000')
})


//connection with database
const connection=require('./database/dbsetup');
async function testConnection() {
    try {
        // Authenticate the connection
        await connection.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testConnection();