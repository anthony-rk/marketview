var express = require('express');
var router = express.Router();

var userController = require('../controller/userController');
const User = require('../models/user');

const passport = require("passport");

router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', userController.user_create_post);

router.get('/login', userController.user_login_get);

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;