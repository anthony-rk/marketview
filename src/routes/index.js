var express = require('express');
var router = express.Router();
const fetch = require("node-fetch");

var userController = require('../controller/userController');
const User = require('../models/user');

const passport = require("passport");
const { json } = require('body-parser');

// Index route handler
router.get('/', userController.user_get_index);

// About page route handler
router.get('/about', (req, res) => {
    res.render('about');
});

// Signup specific route handlers
router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', userController.user_create_post);

// Login specific route handlers
router.get('/login', userController.user_login_get);

router.post('/login',   
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) { res.redirect('/') }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});

// Test route for Charting API
// router.get('/charting', (req, res) => {
//     res.render('charting', {stockResponse: { stockname: 'AAPL', }})
// });

// Add a stock to the user's portfolio
router.post('/add-stock', userController.user_add_stock);

// Delete a stock from the user's portfolio
router.post('/delete-stock', userController.user_delete_stock);

// Get stock data for charting from Alpha Vantage API
router.get('/get-stock-data/:stockTicker', (req, res) => {    
    const stockTicker = req.params.stockTicker;

    let site = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stockTicker + '&apikey=' + process.env.ALPHAVANTAGE_API_KEY;

    console.log(site);

    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

    let response = fetch(site, requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log('Result below', result)
            // let stockResponse = result;
            res.render('charting', {stockResponse: result});
        })
        .catch(error => console.log('error', error))

        
    // res.render('charting', {stockResponse: {
    //     stock: 'AAPL'
    // }});

        // Do I need to wait longer here for data to load?
        // .then(data => {
            // let stockResponse = {};
            // res.render('charting', {stockResponse: result});

            // res.redirect('charting');
              
        // })
        
        // .catch(error => console.log('error', error))
});

// OBJECT PASSING TEST PAGE
router.get('/passing', function(req, res) {
    var mascots = [
        { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
        { name: 'Tux', organization: "Linux", birth_year: 1996},
        { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
    ];
    var tagline = "No programming concept is complete without a cute animal mascot.";

    res.render('passing', {
        mascots: mascots,
        tagline: tagline
    });
});



module.exports = router;