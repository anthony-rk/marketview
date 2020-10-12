var User = require('../models/user');

const bcrypt = require("bcryptjs");
const fetch = require("node-fetch");

const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Display Index page
exports.user_get_index = function(req, res) {
    // async/await
    async function stockGetter() {
        const user = await User.findOne({username: req.user.username}).exec();

        if (typeof user.stocks[0] !== 'undefined') {
            let userStockToDisplay = user.stocks[0];
            res.redirect(`/get-stock-data/${userStockToDisplay}`);      
            // console.log(1);
            // console.log(user.stocks[0]);
        } else {
            let userStockToDisplay = 'FB';
            res.redirect(`/get-stock-data/${userStockToDisplay}`);      

            // console.log(2);
        }
    };
    try {
        if (req.user) {
            stockGetter();
        } else {
            let userStockToDisplay = 'FB';
            res.redirect(`/get-stock-data/${userStockToDisplay}`);    
        }

    } catch (err) { 
        console.log(err)
    };
};

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

exports.user_add_stock = function(req, res) {
    User.findOne({username: req.user.username}, function(err, user) {
        user.stocks.push(req.body.stock);
        user.save();
    });
    res.redirect('/');
};

exports.user_delete_stock = function(req, res) {
    User.findOne({username: req.user.username}, function(err, user) {
    
        const stockTicker = req.params.stockTicker;
        
        const stockIndex = user.stocks.indexOf(stockTicker);
        
        if (stockIndex > -1) { 
            user.stocks.splice(stockIndex, 1) ;
        } else {
            console.log("Could not remove stock at index " + stockIndex);
        }
        user.save();
    });
    
    res.redirect('/');
};

exports.get_stock_price_history_data = function(req, res) {
    const stockTicker = req.params.stockTicker;

    let siteForStockData = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stockTicker + '&apikey=' + process.env.ALPHAVANTAGE_API_KEY;
    let siteForCompanyData = 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + stockTicker + '&apikey=' + process.env.ALPHAVANTAGE_API_KEY2;

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

    // Need to fetch from 2 Sites, then render the index
    function fetchStockDetails(api_url, options) {
        return fetch(api_url, options)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log('error', error))
      }
      
      function fetchCompanyDetails(api_url, options) {
        return fetch(api_url, options)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => console.log('error', error))
      }
      
      // Anonymous Async function to fetch the stock and company details then render the index view
      (async () => {
        const stockResponse = await fetchStockDetails(siteForStockData, requestOptions);
        const stockCompanyResponse = await fetchCompanyDetails(siteForCompanyData, requestOptions);

        console.log(stockCompanyResponse);

      res.render('index', {
          stockResponse: stockResponse,
          stockCompanyResponse: stockCompanyResponse,
        });
      
      })();

};