var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');
const User = require('../models/user');

const passport = require("passport");

// Index route handler
router.get('/', (req, res) => {
    // async/await
    async function stockGetter() {
        const user = await User.findOne({username: req.user.username}).exec();

        res.render('index', { user: req.user, userStocks: user.stocks} );
    };
    try {
        if (req.user) {
            stockGetter();
        } else {
            res.render('index', { user: '', userStocks: []});
        }

    } catch (err) { 
        console.log(err)
    };
});

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
  function(req, res) {
    res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});

// Test route for Charting API
router.get('/charting', (req, res) => {
    res.render('charting');
});

// Add a stock to the user's portfolio
router.post('/add-stock', (req, res) => {
    // User.findOne({username: 'Market_Mark'}, function(err, user) {
    User.findOne({username: req.user.username}, function(err, user) {
        user.stocks.push(req.body.stock);
        user.save();
    });
    res.redirect('/');
});

// Delete a stock to the user's portfolio
router.post('/delete-stock', (req, res) => {
    User.findOne({username: req.user.username}, function(err, user) {
        let stockInputString = req.body.stock.split(" ");
        
        const stockIndex = user.stocks.indexOf(stockInputString[1]);
        
        if (stockIndex > -1) { 
            user.stocks.splice(stockIndex, 1) ;
        } else {
            console.log("Could not remove stock at index " + stockIndex);
        }
        user.save();
    });
    
    res.redirect('/');
});



module.exports = router;