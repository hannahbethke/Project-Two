// DEPENDENCIES
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const timesheetsController = require('./controllers/timesheets');
const usersController = require('./controllers/users');
require('dotenv').config();


// CONFIGURATION
const { DATABASE_URL, PORT, SECRET } = process.env;
const app = express(); 

app.use(expressLayouts); 
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.use('/timesheets', timesheetsController);
app.use('/users', usersController);
app.set('view engine', 'ejs');


// SESSION MIDDLEWARE
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(async function(req, res, next) {
    if(req.session && req.session.user) {
        const user = await require('./models/user').findByID(req.session.user);
        res.locals.user = user;
    } else {
        res.locals.user = null;
    }
    next();
});

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL);
mongoose.connection.on('error', (error) => {
    console.error(error.message + 'mongoDB error');
});
mongoose.connection.on('connected', () => {
    console.log('mongoDB is connected');
});
mongoose.connection.on('disconnected', () => {
    console.log('mongoDB is disconnected');
});

// CONTROLLERS
app.get('/', (req, res) => {
    res.redirect('/homepage');
});

app.get('/homepage', (req, res) => {
    res.render('homepage.ejs');
});

// app.get('/login', (req, res) => {
//     res.render('./users/login.ejs');
// });

// app.get('/signup', (req, res) => {
//     res.render('./users/signup.ejs');
// });

// app.get('/user/profile', (req, res) => {
//     res.render('./users/profile.ejs');
// });


// LISTENER
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`)
})

