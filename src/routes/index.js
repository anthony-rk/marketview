const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // return res.send("Hello there!");
    res.render('index');
});

module.exports = router;