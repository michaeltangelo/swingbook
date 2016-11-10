var mongoose = require('mongoose'), 
	URLSlugs = require('mongoose-url-slugs');


// Level
// *represents the level of difficulty or skill of a dancer or move
var Level = new mongoose.Schema( {
    title: String,
    level: {type: Number, min: 1, max: 5}
});

// post
// *represents a post on an event page
var Post = new mongoose.Schema( {
    event: {type: mongoose.Schema.ObjectId, ref: 'event'},
    text: String,
    user: {type: mongoose.Schema.ObjectId, ref: 'user'},
    datePosted: Date,
});


// move
// *used to represent a swing dance move
var Move = new mongoose.Schema( {
    moveName: String,
    difficulty: Level,
    description: String,
    videoLink: String,
});

// event
// *represents a swing dance event
var Event = new mongoose.Schema( {
    date: Date,
    start: String,
    end: String,
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

// create a schema
var User = new mongoose.Schema({
	name: {
		first: String,
		last: {type: String, trim: true}
	},
	username: { type: String, unique: true },
	password: { type: String},
	joined: Date,
	lastUpdated: Date,
	friends: [mongoose.Schema.ObjectId],
	level: Level,
	eventsList: [Event],
	bio: {
		about: String,
		favoriteMove: Move,
		favoriteEvent: Event,
		pastEvents: [Event],
	},
	fb: {
		id: String,
		access_token: String,
		firstName: String,
		lastName: String,
		email: String
	}
});

User.pre('save', function(next) {
	// get current date
	var currentDate = new Date();

	// change lastUpdated field to current date
	this.lastUpdated = currentDate;

	// if joined doesn't exist, add to field
	if (!this.joined) this.joined = currentDate;

	next();
});
/*
// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists to keep track of loved ones' sleep schedules too
// * (even though I think it is weird to log on others' sleep schedule )
var User = new mongoose.Schema({
    //username, password provided by plugin

    // list of friends by id
    friends: [_id],

    // dance experience level
    level: level,

    // biography object
    biography: bio,

    // List of attending and attended events
    eventsList: [event]
});

// bio
// *used to represent each user's specific bio
var Bio = new mongoose.Schema({
    // user ID - the link to the user the bio belongs to
    userId: ObjectId(user),
    name: text,
    about: text,
    // User's favorite move
    favoriteMove: move,

    // User's favorite event
    favoriteEvent: event,

    // List of user's past attended events
    history: [event],

    // The level of the user - taken from level from user field
    level: level
});
*/

// // Note
// // *represents a note about a specific event
// var Note = new mongoose.Schema( {
//     event: Event,
//     note: text,
//     user: objectId(user),
//     date: date,

//     // The moves 'tagged' in the note
//     moves: [move]
// });


// // type
// // *represents a type of swing dance move
// var MoveType = new mongoose.Schema( {
//     name: text (examples are 'swing out', 'pass', 'charleston', 'misc')
// });


// // Diary
// // *represents the diary of a swing dancer to have notes about moves and events
// var Diary = new mongoose.Schema( {
//     entries: [entry]
// });

// // Entry
// // *represents a single entry in a diary
// var Entry = new mongoose.Schema( {
//     date: date,
//     text: text,
//     moves: [move]
// });

// Implement slugs for a certain schema
// ImagePost.plugin(URLSlugs('title'));

mongoose.model('User', User);
mongoose.model('Move', Move);
mongoose.model('Event', Event);
mongoose.model('Post', Post);
mongoose.model('Level', Level);

mongoose.connect('mongodb://localhost/swingbook');
