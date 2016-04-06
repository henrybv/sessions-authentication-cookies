'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var User = require('../api/users/user.model');

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

// app.use(function (req, res, next) {
//   if (!req.session.counter) req.session.counter = 0;
//   console.log('COUNTER', ++req.session.counter);
//   next();
// });

app.use(session({
	secret: "tongiscool",
	cookie: {maxAge:10000}
}));

// app.get('/', function(req,res,next){

// })


app.post('/login', function(req,res,next){
	var email = req.body.email; 
	var password = req.body.password;

	User.findOne({
		email: email,
		password: password
	}).then(function(user){
		if(!user){
			res.sendStatus(401);
		}
		else {
			req.session.userId = user._id;
			console.log("THIS IS SESSION",req.session);
			res.sendStatus(200);
		}
	})
	.then(null,next);
});

app.use('/api', require('../api/api.router'));


var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

module.exports = app;