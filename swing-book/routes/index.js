var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {message: req.flash('message')});
	// var newUser = new User( {
	// 	name: {first: "Joe", last: "Fursoza"},
	// 	username: "jversoza",
	// 	password: "cats",
	// });

	// var theDate = new Date();
	// var newEvent = new Event( {
	// 	date: theDate,
	// 	start: "9:00PM",
	// 	end: "1:00AM",
	// 	name: "Frim Fram",
	// 	location: "412 8th Ave, 6th Floor"
	// });
	// var context = {title: 'Express', User: newUser, Event: newEvent};
	// res.render('index', context);
});

router.post('/login', passport.authenticate('login', {
	successRedirect: '/home',
	failureRedirect: '/',
	failureFlash : true
}));

router.get('/register', function(req, res) {
	res.render('register', {message: req.flash('message')});
});

router.get('/home', function(req,res) {
	res.render('index', {Event: "I AM HOME PAGE"});
});

router.post('/register', passport.authenticate('register', {
	successRedirect: '/home',
	failureRedirect: '/register',
	failureFlash : true
}));

module.exports = router;
// module.exports = function(passport){
 
//   /* GET login page. */
//   router.get('/', function(req, res) {
//     // Display the Login page with any flash message, if any
//     res.render('index', { message: req.flash('message') });
//   });
 
//   /* Handle Login POST */
//   router.post('/login', passport.authenticate('login', {
//     successRedirect: '/home',
//     failureRedirect: '/',
//     failureFlash : true 
//   }));
 
//   /* GET Registration Page */
//   router.get('/signup', function(req, res){
//     res.render('register',{message: req.flash('message')});
//   });
 
//   /* Handle Registration POST */
//   router.post('/signup', passport.authenticate('signup', {
//     successRedirect: '/home',
//     failureRedirect: '/signup',
//     failureFlash : true 
//   }));
 
//   return router;
// }