
import express from 'express';
const router = express.Router();
import User from "../models/user.js"
import bcrypt from "bcrypt";
import passport from "passport";
import passportConfig from '../config/passport.js';
//login handle
const login =(req,res)=>{
    res.render('login');
}

const register = (req,res)=>{
    res.render('register');
}

//Register handle

const userRegister = (req,res)=>{
    const {name,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
if(!name || !email || !password || !password2) {
    errors.push({msg : "Please fill in all fields"})
}
//check if match
if(password !== password2) {
    errors.push({msg : "passwords dont match"});
}

//check if password is more than 6 characters
if(password.length < 6 ) {
    errors.push({msg : 'password atleast 6 characters'})
}
if(errors.length > 0 ) {
res.render('register', {
    errors : errors,
    name : name,
    email : email,
    password : password,
    password2 : password2})
} else {
    //validation passed
   User.findOne({email : email}).exec((err,user)=>{
    console.log(user + "yoo");   
    if(user) {
        errors.push({msg: 'email already registered'});
         render(res,errors,name,email,password,password2);
        
       } else {
        const newUser = new User({
            name : name,
            email : email,
            password : password });
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser
                    .save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!')
                    res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));   
       }
    })
    }
}

 passportConfig(passport);
// app.use(passport.initialize());
// app.use(passport.session());

const userLogin =(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true,
        })(req,res,next);
}

//logout
const logout = (req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login');
}
 
export {login, register, userRegister, userLogin, logout};