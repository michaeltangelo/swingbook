var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');


/* GET home page. */
router.get('/', function(req, res, next) {
	/*
	// event
// *represents a swing dance event
var Event = new mongoose.Schema( {
    date: Date,
    start: Date,
    end: Date,
    name: String,
    location: String,

    // The maybe attending users
    maybes: [{type: mongoose.Schema.ObjectId, ref: 'maybes'}],

    // the for sure attending users
    attending: [{type: mongoose.Schema.ObjectId, ref: 'attending'}],

    notAttending: [{type: mongoose.Schema.ObjectId, ref: 'notAttending'}],

    posts: [Post],
    // mostRecentNote: note,

    // The average level of dancers at the event
    // avgLevel: Level,
});
	*/
	var newUser = new User( {
		name: {first: "Joe", last: "Fursoza"},
		username: "jversoza",
		password: "cats",
	});

	var theDate = new Date();
	var newEvent = new Event( {
		date: theDate,
		start: "9:00PM",
		end: "1:00AM",
		name: "Frim Fram",
		location: "412 8th Ave, 6th Floor"
	});
	var context = {title: 'Express', User: newUser, Event: newEvent};
	res.render('index', context);
});

module.exports = router;
