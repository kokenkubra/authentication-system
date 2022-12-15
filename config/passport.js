//const LocalStrategy = require('passport-local').Strategy;
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

export default function(passport){
    passport.use(
        new LocalStrategy({usernameField : 'email'},(email,password,done)=> {
                //match user
                User.findOne({email : email})
                .then((user)=>{
                 if(!user) {
                     return done(null,false,{message : 'that email is not registered'});
                 }
                 //match pass
                 bcrypt.compare(password,user.password,(err,isMatch)=>{
                     if(err) throw err;

                     if(isMatch) {
                         return done(null,user);
                     } else {
                         return done(null,false,{message : 'pass incorrect'});
                     }
                 })
                })
                .catch((err)=> {console.log(err)})
        })
        
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      }); 
}; 
