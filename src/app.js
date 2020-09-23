import 'dotenv/config';

const express = require('express');
const cors = require('cors');
const path = require('path');
const partials = require('express-partials');
const mongoose = require('mongoose');
const session = require("express-session");


// Setup MongoDB connection
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const indexRouter = require('./routes/index');

const app = express();

app.use(partials());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('src'));

app.use(cors());

app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, () => 
    console.log("Example app listening on port " + process.env.PORT +  "!")
);