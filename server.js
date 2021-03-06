'use strict';
var path = require('path');
var express = require('express');
var routes = require(path.join(__dirname, '/app/index.js'))
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGOLAB_URL);
mongoose.Promise = global.Promise;

app.use('/public', express.static(process.cwd() + '/public'));

app.use(session({
	secret: 'nightlifeapp',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
