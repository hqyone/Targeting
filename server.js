/**
 * Created by hqyone on 7/5/16.
 */
var express  = require("express");
//var cookieParser = require('cookie-parser');  //For user authorization:   based on http://idlelife.org/archives/808
//var session = require('express-session');     //For user authorization
var path = require("path");
var bodyParser = require("body-parser");
var fs =  require('fs');
var csv = require("fast-csv");
var http = require('http');
var url = require('url');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var flash = require('express-flash');
var commander = require('./js/tools/command.js');