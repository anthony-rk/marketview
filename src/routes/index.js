var express = require('express');
var router = express.Router();

// const user_controller = require('../controller/userController');
var userController = require('../controller/userController');

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

// Test for POST
// router.post('/signup', (req, res) => {
//     res.send("hello there!");
// });

router.get('/login', (req, res) => {
    res.render('login');
});

// Test for POST
router.post('/login', (req, res) => {
    res.send("hello there login page!");
});

module.exports = router;