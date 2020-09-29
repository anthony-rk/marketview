var User = require('../models/user');

const bcrypt = require("bcryptjs");
const async = require('async');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display user sign up form
exports.user_create_get = function(req, res) {
    res.render('signup', { title: 'New User Sign Up'} );
};

// Create new user from User sign up POST request
exports.user_create_post = [

    // Validate fields.
    body('username').isLength({ min: 1 }).trim().withMessage('Username must be specified.'),
    body('password')
        .isLength({ min: 1 })
        .withMessage('Password is required.')
        .custom((value,{req, loc, path}) => {
            if (value !== req.body.confirmPassword) {
                // throw error if passwords do not match
                throw new Error("Passwords must match");
            } else {
                return value;
            }
        })
        .withMessage('Passwords must match.'),
    body('confirmPassword')
        .isLength({ min: 1 })
        .withMessage('Confirm password is required.')
        .custom((value,{req, loc, path}) => {
            if (value !== req.body.password) {
                // throw error if passwords do not match
                throw new Error("Passwords must match");
            } else {
                return value;
            }
        })
        .withMessage('Passwords must match.'),    
    body('email').isLength({ min: 5 }).trim().withMessage('Email must be specified.'),

    // Sanitize fields.
    sanitizeBody('username').escape(),
    sanitizeBody('password').escape(),
    sanitizeBody('confirmPassword').escape(),
    sanitizeBody('email').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('signup', { title: 'New User Sign Up', errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create a User object with escaped and trimmed data.
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                    // if err, do something
                    if (err) { 
                        return next(err);
                    };
                    // otherwise, store hashedPassword in DB
                    const user = new User({
                        username: req.body.username,
                        password: hash,
                        email: req.body.email,
                    }).save(err => {
                        if (err) { 
                            return next(err);
                        };
                        res.redirect("/");
                    })
            });
        })
    }
}];

// Display user Login form
exports.user_login_get = function(req, res) {
    res.render('login', { title: 'New User Login'} );
};

exports.user_add_stock_post = (req, res) => {
    // need to find user, then add to their Stock array
    res.render('/');
};

exports.user_get_stocks1 = (req, res) => { 
    User.findOne({username: 'Market_Mark'}, function(err, user) {
        return user.stocks;
    });
};

exports.user_get_stocks = function(req, res, next) {

    // async.parallel({
    //     user_instance: function(callback) {
    //         let stocks = User.findOne({username: 'Market_Mark'}).exec(callback);
    //         // BookInstance.findById(req.params.id).populate('user').exec(callback)
    //     },
    // }, function(err, results) {
    //     if (err) { return next(err); }
    //     if (results.user_instance==null) { // No results.
    //         res.redirect('/');
    //     }
    //     // Successful, so render.
    //     res.render('/', { user: req.user, user_instance: results.user_instance} );
    // });


    // async/await
    async function stockGetter() {
        const userStocks = await User.findOne({username: 'Market_Mark'}).exec();
        
        res.render('/', { user: req.user, userStocks: userStocks} );
        // console.log(user.stocks)
    };
    stockGetter()

};