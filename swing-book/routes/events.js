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
	// Event.find({}).sort('-date').exec(function(err, events) {
	// 	res.render('events', {events: events, user: req.user});
	// });

 // date: {$gt: now, $lt: now + 7 * 24 * 60 * 60 * 1000}
 	var loggedIn = false;
 	if (req.isAuthenticated()) {
 		loggedIn = true;
 	}
	var now = new Date();
	Event.find({
	}).sort('-date').exec(function(err, events) {
		res.render('events', {events: events, user: req.user, loggedIn: loggedIn});
	});
});

router.get('/create', isAuthenticated, function(req, res, next) {
	res.render('events-create', {user: req.user, loggedIn: true});
});

router.get('/:slug', function(req, res, next) {
	var requestSlug = req.params.slug;
	Event.find(function(err, events, count) {
		var event;
		for (var key in events) {
			if (events[key].slug === requestSlug) {
				event = events[key];
				break;
			}
		}
		// got the event. loop through the event's attending list
		var calls = [];
		event.attending.forEach(function(userId) {
			calls.push(function(cb) {
				User.findById(userId, function(err, user) {
					if (err) return cb(err);
					cb(null, user);
				});
			});
		});

		async.parallel(calls, function(err, users) {
			if (err) console.log("Error in finding user by id.");
			else {
				var userMap = {};
				console.log("FINISHED ALL CALLS");
				for (var id in users) {
					userMap[id] = users[id];
				}
				res.render('events-single-view', {event: event, userMap: userMap, loggedIn: true});
			}
		});
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
		if (err) {
			console.log("Could not find event with slug: " + requestSlug);
		}
		// console.log("Looping through all events");
		var found = false;
		event.attending.forEach(function(ele) {
			console.log("Looping through: " + JSON.stringify(ele));
			if (JSON.stringify(ele) === JSON.stringify(req.user._id)) {
				console.log("Found a match: " + JSON.stringify(ele));
				found = true;
			}
		});
		if (found) {
			res.send('attending');
		}
		else {
			res.send('FAILURERAWERAWER');
		}
		return;
	});
});

router.post('/:slug/remove', function(req, res, next) {
	if (!req.isAuthenticated()) {
		res.send('failed');
		return;
	}

	var requestSlug = req.params.slug;

	// console.log("Attempting to find event with slug: " + requestSlug);
	Event.findOne({slug:requestSlug}, function(err, event) {
		// console.log("Found an event with attending list: " + event.attending);
		var indexToRemove = 0;
		for (var i = 0; i < event.attending.length; i++) {
			// console.log("event.attending[i]: " + event.attending[i]);
			// console.log("JSON.stringify(req.user._id): " + JSON.stringify(req.user._id));
			if (JSON.stringify(event.attending[i]) === JSON.stringify(req.user._id)) {
				// console.log("Found a match in event with user: " + req.user +"| index: " + i);
				indexToRemove = i;
				break;
			}
		}
		var removedId = event.attending.splice(indexToRemove, 1)[0];
		event.save(function(err) {
			if (!err) {
				User.findById(removedId, function(err, user) {
					console.log(user);
					if (!err && user) {
						console.log("removing user.firstName: " + user.firstName);
						res.send('removed' + ',' + user.firstName + ',' + user.lastName);
					}
					else console.log("Passing back the username of the user removed from event list");
				});
			}
			else res.send('error in removing user');
		})
	});
});

router.post('/:slug/join', function(req, res, next) {
	console.log("Hit the join post for slug: " + req.params.slug)
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
						User.findById(req.user._id, function(err, user) {
							if (!err) res.send('added' + ',' + user.firstName + ',' + user.lastName);
							else console.log("Passing back the username of the user added to event list");
						});
					}
					else {
						console.log("Could not update event");
						res.send('error in saving');
					}
				});
			}
			else {
				console.log("WE HERE1");
				res.send('Already exists');
				return;
			}
		}
		else {
			console.log("Error in database: " + err);
			res.send('error in database: ' + err);
			return;
		}
	})
	// Event.findOneAndUpdate({})
	// res.send(req.user._id)
});

router.post('/create', isAuthenticated, function(req, res, next) {
	console.log(req.body);
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var newEvent = new Event();
	var date = new Date(req.body.date+'T00:00:00');
	newEvent.date = date;
	newEvent.day = date.getUTCDate();
	newEvent.dayName = days[date.getUTCDay()];
	newEvent.month = date.getUTCMonth()+1;
	newEvent.monthName = months[date.getUTCMonth()];
	console.log("Saving month name as: " + months[date.getUTCMonth()]);
	newEvent.year = date.getFullYear();

	function convert24to12(time) {
		var split = time.split(":");
		var hours = split[0];
		var hours12 = parseInt(hours) > 12 ? (parseInt(hours) - 12) : hours;
		var minutes = split[1];
		var timeOfDay = parseInt(hours) < 12 ? "AM" : "PM";
		return hours12+":"+minutes+" "+timeOfDay;
	}
	newEvent.start = convert24to12(req.body.start);
	newEvent.end = convert24to12(req.body.end);
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