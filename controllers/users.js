const usersRouter = require('express').Router();
const User = require('../models/user');
const Timesheet = require('../models/timesheet');

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// add router middleware
const auth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/users/login');
    };
};

// user dashboard GET route
usersRouter.get('/dashboard', auth, (req, res) => {
    User.findById(req.session.user, (err, user) => {
        res.render('./users/dashboard.ejs', { user });
    });
});

// login GET route
usersRouter.get('/login', (req, res) => {
    res.render('./users/login.ejs', { err: '' });
});

// login POST route - authenticate/login a user
usersRouter.post('/login', (req, res) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email }, '+password', (err, foundUser) => {
        if (err) {
            console.log(err);
        }
        if (!foundUser) {
            console.log('account does not exist')
            return res.render('./users/login.ejs', { err: 'Account does not exist' });
        };
        if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
            console.log('authentication failed')
            return res.render('./users/login.ejs', { err: 'Email or Password is incorrect' });
        };
        req.session.user = foundUser._id
        res.redirect('/users/dashboard');
    })
})

// signup GET route
usersRouter.get('/signup', (req, res) => {
    res.render('./users/signup.ejs', { err: '' });
});

// signup POST route - create a new user 
usersRouter.post('/signup', (req, res) => {
    // if (req.body.password.length < 8) {
    //     return res.render('./users/signup.ejs', { err: 'Password must be at least 8 characters long'})
    // }
    console.log(req.body);
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
    req.body.password = hash;
    User.create(req.body, (error, user) => {
        if (error) {
            res.render('./users/signup.ejs', { err: 'There is already an account associated with this email'});
        } else {
            console.log(user);
            req.session.user = user._id
            res.redirect('/users/dashboard');
        }
    });
});

// logout route
usersRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/homepage');
    });
});




// user profile GET route
usersRouter.get('/profile', (req, res) => {
    User.findById(req.session.user, (err, user) => {
        res.render('./users/profile.ejs', { user })
    });
});

// profile UPDATE route - updates the user in the database
usersRouter.put('/profile/edit', auth, (req, res) => {
    // if (req.body.password.length < 8) {
    //     return res.render('./users/edit.ejs', { err: 'Password must be at least 8 characters long' });
    // }
    const hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(SALT_ROUNDS));
    req.body.password = hash;
    User.findByIdAndUpdate(req.session.user, req.body, { new: true }, (err, user) => {
        res.redirect('/users/profile');
    });
});

// profile DELETE route - deletes the user from the database
usersRouter.delete('/profile', auth, (req, res) => {
    User.findByIdAndDelete(req.session.user, (err, user) => {
        Timesheet.deleteMany({ user: req.session.user }, (err, logs) => {
            req.session.destroy(() => {
                res.redirect('/homepage');
            });
        });
    });
});

module.exports = usersRouter;