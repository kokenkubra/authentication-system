
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {welcome, reg, dash} from './routes/index.js';
import {login, register, userRegister, userLogin, logout} from './routes/users.js';
import expressEjsLayouts from 'express-ejs-layouts';
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import passportConfig from './config/passport.js';
import ensureAuthenticated from "./config/auth.js"


// Create a new Express application
const app = express();
// Set up MongoDB connection
dotenv.config();
mongoose
.connect(process.env.MONGO_URI, {useNewUrlParser: true,useUnifiedTopology: true})
.then(() => console.log('DB connected!'))
.catch(err => console.error(err));



// Set up EJS as the view engine
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(expressEjsLayouts);
// Use body-parser to parse form data sent via HTTP POST
app.use(bodyParser.urlencoded({ extended: true }));

// Use body-parser to parse JSON data sent via HTTP POST
app.use(bodyParser.json());
app.use(express.urlencoded({extended : false}));
// Set up a route to serve the homepage
//express session
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true
 }));
 passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

 //use flash
 app.use(flash());
 app.use((req,res,next)=> {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error  = req.flash('error');
 next();
 })
app.get('/users/login', login);
app.get('/users/login', login);
app.get('/users/register', register);
app.post('/users/register', userRegister);
app.post('/users/login', userLogin);
app.get('/users/logout', logout);
app.get('/', welcome);
app.get('/register', reg);

app.get('/dashboard',ensureAuthenticated,dash)
// Start the server on port 3000

app.listen(3000, () => {
  console.log('MERN app listening on port 3000!');
});

