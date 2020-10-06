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

// Add a stock to the user's portfolio
router.post('/add-stock', userController.user_add_stock);

// Delete a stock from the user's portfolio
router.post('/delete-stock', userController.user_delete_stock);

// Get stock data for charting from Alpha Vantage API
router.get('/get-stock-data/:stockTicker', userController.get_stock_price_history_data);

module.exports = router;