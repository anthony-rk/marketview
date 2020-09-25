var express = require('express');
var router = express.Router();

// const user_controller = require('../controller/userController');
var userController = require('../controller/userController');
const user = require('../models/user');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', userController.user_create_post);


router.get('/login', userController.user_login_get);

// router.post('/login', userController.user_login_post);

module.exports = router;