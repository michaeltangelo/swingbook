var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var passport = require('passport');
var async = require('async');

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

// Get default /events page
// Show only the next week of events
router.get('/', function(req, res, next) {
	res.render('dj', {message: 'SwingDJ is coming soon!'});
});

module.exports = router;