var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bCrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var expressSession = require('express-session');
var flash = require('connect-flash');
var async = require('async');

// Non auto express-generator requires
var db = require('./db.js');
var User = mongoose.model('User');
var fbConfig = require('./public/javascripts/fb.js');

// Routes Initialization
var index = require('./routes/index')(passport);
var users = require('./routes/users');
var events = require('./routes/events');

var app = express();	

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up express session
app.use(expressSession({secret: 'texas tommy'}));

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// setup flash
app.use(flash());

app.use('/', index);
app.use('/user', users);
app.use('/events', events);

// referenced from:
// https://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    username = username.toLowerCase();
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method
        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        if (user.password) {
          // User exists but wrong password, log the error 
          if (!bCrypt.compareSync(password, user.password)){
            console.log('Invalid Password');
            return done(null, false, 
                req.flash('message', 'Invalid Password'));
          }
          // User and password both match, return user from 
          // done method which will be treated like success
          return done(null, user);
        }
        else {
          return done(null, false,
                req.flash('message', 'Please login using Facebook.'));
        }
      }
    );
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Also referenced from:
// https://code.tutsplus.com/tutorials/authenticating-nodejs-applications-with-passport--cms-21619
passport.use('register', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
  	console.log("Inside the register passport strategy. req body: " + JSON.stringify(req.body));
    findOrCreateUser = function(){
      username = username.toLowerCase();
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
      	console.log("Inside FindorcreateUser in app.js | username: " +username);
        // In case of any error return
        if (err){
          console.log('Error in register: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } 
        else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          // Function from http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
          function upperCaseFirst(str){
            return str.charAt(0).toUpperCase() + str.substring(1);
          }
          newUser.firstName = upperCaseFirst(req.body.firstName);
          newUser.lastName = upperCaseFirst(req.body.lastName);
          newUser.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
          newUser.joined = new Date();
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser, req.flash('message','User Registration successful'));
          });
        }
      });
    };
     
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
 }));

passport.use('facebook', new FacebookStrategy({
  clientID        : fbConfig.appID,
  clientSecret    : fbConfig.appSecret,
  callbackURL     : fbConfig.callbackUrl,
  profileFields   : ['id','friends', 'email', 'first_name', 'last_name']
},
 
  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {
  	console.log("\n\nProfile: " + JSON.stringify(profile)+"\n\n");
    // asynchronous
    process.nextTick(function() {
     
      // find the user in the database based on their facebook id
      User.findOne({ 'fb.id' : profile.id }, function(err, user) {
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err){
        	console.log("err in User.findOne: " + err);
          return done(err);
      	}
 
          // if the user is found, then log them in
          if (user) {
          	console.log("User is found.");
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
            console.log("Default newUser: " + newUser);
			newUser.joined = new Date();

            // set all of the facebook information in our user model
            newUser.fb.id    = profile.id; // set the users facebook id                 
            newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user                    
            newUser.fb.firstName  = profile.name.givenName;
            newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.firstName = profile.name.givenName;
            newUser.lastName = profile.name.familyName;
            newUser.username = (newUser.fb.firstName + "" +newUser.fb.lastName).toLowerCase();
            console.log("4Set all newUser properties. newUser is now: " + newUser);
            console.log("profile: " + JSON.stringify(profile));
            // newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
 
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, newUser);
            });
         } 
      });
    });
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
