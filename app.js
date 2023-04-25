//jshint esversion:6
const express=require('express')
const bodyParser=require('body-parser')
const ejs = require("ejs");
const encrypt=require('mongoose-encryption')
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const mongoose=require('mongoose')
require('dotenv').config()

mongoose.connect('mongodb://127.0.0.1:27017/userDB')

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

//console.log(process.env.API_KEY);

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });


const User=new mongoose.model('user',userSchema)



app.get("/",(request,response)=>{
    response.render('home')
})

app.get("/login",(request,response)=>{
    response.render('login')
})


app.get("/register",(request,response)=>{

    response.render('register')
})

app.get("/logout",(request,response)=>{

    response.render('home')
})


app.post('/register',(request,response)=>{
    const newUser=new User({
        email:request.body.username,
        password:request.body.password
    })
    newUser.save()
    .then(function () {
        response.render("secrets");
        })
    .catch(function (err) {
        response.send(err);
        })
})

app.post('/login',(request,response)=>{
    const username=request.body.username;
    const password=request.body.password
    User.findOne({email:username})
    .then((founduser)=>{
        if (founduser.password===password){
            response.render('secrets')
        }
    })
    .catch((err)=>{
console.log(err);
    })

})







app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
