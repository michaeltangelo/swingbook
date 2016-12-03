var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var passport = require('passport');

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/', function(req, res, next) {
	Event.find({}).sort('-date').exec(function(err, events) {
		res.render('events', {events: events});
	});
});

router.get('/create', isAuthenticated, function(req, res, next) {
	console.log(Date.now());
	res.render('events-create');
});

router.post('/create', isAuthenticated, function(req, res, next) {
	console.log(req.body);
	var newEvent = new Event();
	newEvent.date = new Date(req.body.date);
	newEvent.start = req.body.start;
	newEvent.end = req.body.end;
	newEvent.name = req.body.name;
	var recurring = req.body.recurring;
	newEvent.location = req.body.location;
	if (req.body.imageUrl) {
		newEvent.imageUrl = req.body.imageUrl;
	}

	if (req.body.description) {
		newEvent.description = req.body.description;
	}
	newEvent.save(function(err) {
		if (err) {
			console.log("Error saving event: " + err);
			throw err;
		}
		console.log("Successfully saved event.");
		res.redirect('/events');
	});
})

module.exports = router;