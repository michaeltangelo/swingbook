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
		res.render('events', {events: events, user: req.user});
	});
});

router.get('/create', isAuthenticated, function(req, res, next) {
	res.render('events-create', {user: req.user});
});

router.get('/:slug', function(req, res, next) {
	var requestSlug = req.params.slug;
	Event.find(function(err, events, count) {
		for (var key in events) {
			if (events[key].slug === requestSlug) {
				var event = events[key];
				res.render('events-single-view', {event: event});
			}
		}
	});
});

router.post('/:slug/check', function(req, res, next) {
	console.log("Inside check");
	if (!req.user) {
		console.log("user not logged in");
		res.send('not logged in');
		return;
	}

	var requestSlug = req.params.slug;

	Event.findOne({slug:requestSlug}, function(err, event) {
		event.attending.forEach(function(ele) {
			if (JSON.stringify(ele) === JSON.stringify(req.user._id)) {
				res.send('attending');
				return;
			}
		});
	});
});

router.post('/:slug/remove', function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.send('failed');
		return;
	}

	var requestSlug = req.params.slug;

	Event.findOne({slug:requestSlug}, function(err, event) {
		var indexToRemove = 0;
		for (var i = 0; i < event.attending; i++) {
			if (JSON.stringify(event.attending[i]) === JSON.stringify(req.user._id)) {
				indexToRemove = i;
				break;
			}
		}
		event.attending.splice(indexToRemove, 1);
		event.save(function(err) {
			if(!err) res.send('removed');
			else res.send('error in removing user');
		})
	});
});

router.post('/:slug/join', function(req, res, next) {
	// console.log("Hit the join post for slug: " + req.params.slug)
	// if user not logged in, send failed to clientside to redirect to login page
	if (!req.isAuthenticated()) {
		res.send('failed');
		return;
	}

	// else update Event attendees lists
	var requestSlug = req.params.slug;

	Event.findOne({slug:requestSlug}, function(err, event) {
		if (!err) {
			var unique = true;
				event.attending.forEach(function(ele) {
					if (JSON.stringify(ele) === JSON.stringify(req.user._id)) {
						unique = false;
					}
				});
			if (unique) {
				event.attending.push(req.user._id);
				event.save(function(err) {
					if (!err) {
						res.send('added');
					}
					else {
						res.send('error in saving');
					}
				});
			}
			else {
				res.send('Already exists');
				return;
			}
		}
		else {
			res.send('error in database: ' + err);
			return;
		}
	})
	// Event.findOneAndUpdate({})
	// res.send(req.user._id)
});

router.post('/create', isAuthenticated, function(req, res, next) {
	console.log(req.body);
	var newEvent = new Event();
	var date = new Date(req.body.date);
	newEvent.date = date;
	newEvent.day = date.getDate();
	newEvent.month = date.getMonth()+1;
	newEvent.year = date.getFullYear();
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