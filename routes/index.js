import express from 'express';
const router  = express.Router();
//login page
const welcome =(req,res)=>{
    res.render('welcome');
}
//register page
const reg = (req,res)=>{
    res.render('register');
}
const dash = (req,res)=>{
    res.render('dashboard',{
        user: req.user
        });
    }
export {welcome, reg, dash}; 