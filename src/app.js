import 'dotenv/config';
// import cors from 'cors';
// import express from 'express'; 

const express = require('express');
const cors = require('cors')
const path = require('path');

// import models from './models';
// import routes from './routes';

const indexRouter = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('src'));

app.use(cors());

// app.use('/session', routes.session);
// app.use('/users', routes.user);
app.use('/', indexRouter);

app.listen(process.env.PORT || 3000, () => 
    console.log("Example app listening on port " + process.env.PORT +  "!")
);