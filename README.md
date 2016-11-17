<h1>SwingBook</h1>

<h2>Overview</h2>
>"Should I go swing dancing today?" This age old question is asked dozens, if not hundreds, if not *thousands* of times a day by swing dancers around the world. Although the answer should always be, "yes," sometimes it helps to know who else will be going out that night. SwingBook is a site that allows users to view swing events all around the city (NYC only for now) and indicate whether they intend to attend the event. The core feature of SwingBook is the ability to view other attending dancers and connect with them (before or after) the event. Additionally, users will have the option to include a brief, personal recap/note about which swanky new move they learned at the event itself. Users will have a brief bio describing their level of experience with swing dancing, what they want to get better at, and their 'favorite move', which will be visible to all. Additional features can be added.

rco87Zhe

<h2>Data Model</h2>

  First draft schema:
  
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

    // move
    // *used to represent a swing dance move
    var Move = new mongoose.Schema( {
        name: text,
        difficulty: level,

        // what category of move is it
        type: type,
        description: text,
        video: gif [optional to show the move itself]
    });

    // event
    // *represents a swing dance event
    var Event = new mongoose.Schema( {
        date: date,
        start: time,
        end: time,
        name: text,
        location: location,

        // The maybe attending users
        maybes: [user],

        // the for sure attending users
        attending: [user],

        not-attending: [user],

        messageBoard: [message],
        mostRecentNote: note,

        // The average level of dancers at the event
        avgLevel: number
    });

    // Note
    // *represents a note about a specific event
    var Note = new mongoose.Schema( {
        event: event,
        note: text,
        user: objectId(user),
        date: date,

        // The moves 'tagged' in the note
        moves: [move]
    });

    // post
    // *represents a post on an event page
    var Post = new mongoose.Schema( {
        event: event,
        note: text,
        user: objectId(user),
        date: date
    });

    // type
    // *represents a type of swing dance move
    var MoveType = new mongoose.Schema( {
        name: text (examples are 'swing out', 'pass', 'charleston', 'misc')
    });

    // Level
    // *represents the level of difficulty or skill of a dancer or move
    var Level = new mongoose.Schema( {
        title: text (e.g. intermediate, beginner, advanced),
        level: number (1-5)
    });

    // Diary
    // *represents the diary of a swing dancer to have notes about moves and events
    var Diary = new mongoose.Schema( {
        entries: [entry]
    });

    // Entry
    // *represents a single entry in a diary
    var Entry = new mongoose.Schema( {
        date: date,
        text: text,
        moves: [move]
    });
    
<h2>Wireframes</h2>

/home   -homepage where users can choose to register or login
![Alt text](documentation/images/homepage.jpg?raw=true "homepage")

/events   -users can see events
![Alt text](documentation/images/events.jpg?raw=true "events")

/slug   -users' biography. slug is name or username
![Alt text](documentation/images/bio.jpg?raw=true "view log")

<h2>Site Map </h2>
![Alt text](documentation/images/sitemap.jpg?raw=true "site map")


<h2>User Stories</h2>
>1. as a user, I can view events, see the attendees, and choose to attend them
>2. as a user, I can add a friend
>3. as a user, I can make a note about an event and share what I learned at the event
>4. as a user, I can make a post in the event page for all to see
>5. as a user, I can keep a diary about my progress with swing dance and the moves i've learned and want to learn

<h2>Research Topics</h2>
>1. Integrate user authentication (perhaps with Facebook or google login)
>2. How to perform client side form validation using a JavaScript library (ensure forms get correct data)
>3. Use React.js (to get acclimated with Facebook workflow)
>4. Use CSS framework


