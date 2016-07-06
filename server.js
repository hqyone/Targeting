/**
 * Created by hqyone on 7/5/16.
 */
var express  = require("express");
//var cookieParser = require('cookie-parser');  //For user authorization:   based on http://idlelife.org/archives/808
//var session = require('express-session');     //For user authorization
var path = require("path");
var bodyParser = require("body-parser");
//var fs =  require('fs');
var csv = require("fast-csv");
//var http = require('http');
//var url = require('url');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var flash = require('express-flash');
var commander = require('./js/tools/command.js');


//Global settings:
Targeting={};
Targeting.project_dir = __dirname;
Targeting.ds = {};
Targeting.divs = {}; //The div server, it is the key component to generate visualization

//Configure the local strategy for use by Passport
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
    function(username, password, done) {
        users.findByUsername(username, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                error_message = 'Incorrect username.';
                return done(null, false, { message: 'Incorrect username.' }); }
            if (user.password != password) {
                error_message = 'Incorrect password.';
                return done(null, false, {message: 'Incorrect password.'})
            }
            return done(null, user);
        });
    }));

// Configure Passport authenticated session persistence.
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

// Create a new Express application
var app =  express();


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'caris_ls', resave: false, saveUninitialized: false, cookie: { maxAge: 180000000 } }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

//Initialize/Load datasource into memory
var ds_loader = require(path.join(__dirname+"/js/datasource/ds_loader.js"));
