import 'dotenv/config';

const express = require('express');
const cors = require('cors');
const path = require('path');
const partials = require('express-partials');
const mongoose = require('mongoose');
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var User = require('./models/user');


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

// PassportJS Authentication below
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        };
        if (!user) {
          return done(null, false, { msg: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              return done(null, user)
            } else {
              // passwords do not match!
              return done(null, false, {msg: "Incorrect password"})
            }
          })
        return done(null, user);
      });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


app.use('/', indexRouter);



// Log in || Log out //
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/about",
        failureRedirect: "/signup",
    })

);
  
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });


app.listen(process.env.PORT || 3000, () => 
    console.log("Example app listening on port " + process.env.PORT +  "!")
);