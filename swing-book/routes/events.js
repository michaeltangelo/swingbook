var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Events = mongoose.model('Event');
var passport = require('passport');

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/', function(req, res, next) {
	Events.find({}).sort('-date').exec(function(err, events) {
		console.log("Events: " + events);
		// res.render('events', {user: req.user});
		res.send('Parsed events.');
	});
});

router.get('/create', isAuthenticated, function(req, res, next) {
	res.send('here');
});

module.exports = router;