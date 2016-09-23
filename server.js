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

var users = require('./js/users.js');

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


//Initialize/Load datasource into memory
//var dm = require(path.join(__dirname+"/js/datasource/ds_loader.js"));
//dm.load_code2_ds();

//Set the public folder is public for access
//So html will use /js/ext_libs/jquery-2.1.3.min.js to access the javascript file
app.use(express.static('./public'));

//Parse application/json
app.use(bodyParser.json({limit: '20mb'}));
//app.use(bodyParser({limit: '20mb'}));
app.use(flash());


app.post('/login',
    passport.authenticate('local', { successRedirect: '/public/html',
        failureRedirect: '/login',
        failureFlash: "Invalid username or password",
        successFlash: "Welcome!"
    })
);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

app.all('/public/html', isLoggedIn);
app.get('/public/html', function(req, res){
    console.log(req.user);
    //res.sendFile(path.join(__dirname+'/public/html/index.html'));
    res.sendFile(path.join(__dirname+'/public/html/index.html'));
});

app.get('/login',function(req, res){
    res.sendFile(path.join(__dirname+'/public/html/login.html'));
});

app.get('/logout',
    function(req, res){
        //req.session.destroy();
        //req.logout();
        //res.sendFile(path.join(__dirname+'/public/html/login.html'));
        //res.redirect("/");
        //res.send("logged out", 401);
        req.session.destroy(function () {
            res.redirect(301, '/');
        });
    });

app.get('/logout',
    function(req, res){
        //req.session.destroy();
        //req.logout();
        //res.sendFile(path.join(__dirname+'/public/html/login.html'));
        //res.redirect("/");
        //res.send("logged out", 401);
        req.session.destroy(function () {
            res.redirect(301, '/');
        });
    });

app.get('/todo',
    function(req, res){
        //res.send({title:"a title",completed:false});
        res.json({title:"a title",completed:false});
    });

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/public/html/login.html'));
    //res.sendFile(path.join(__dirname+'/public/html/index.html'))
});

var server = app.listen(3000, function(){
    var host = server.address().address;
    var port  = server.address().port;
    console.log('Listening on part %d', port);
});