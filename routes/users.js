var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    var allUsers = [];

    users.forEach(function(user) {
    	allUsers.push(user.username);
    });

    res.send(JSON.stringify(allUsers));
  });
});

// Get individual user
router.get('/:username', function(req, res, next) {
	username = req.params.username;
	res.send(req.params.username);
});

module.exports = router;

