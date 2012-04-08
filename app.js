
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , util = require('util')

var mongoose = require('mongoose') 

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;




var Schema = mongoose.Schema,
priority = ['low', 'normal', 'high', 'critical'],
logtype = ['information', 'warning' ,'error']; 


var db = mongoose.connect('mongodb://localhost/soldhere');

logItem = new Schema({
    priority  : Number,
    logtype   : Number,
    datetime  : Date,
    msg       : String
});
mongoose.model('logItem', logItem);


var users = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unkown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));





var app = module.exports = express.createServer();
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
 /* app.use(express.session({secret: "thesecretcode"}));
  app.use(passport.initialize());
  app.use(passport.session());*/
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/*
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});
*/

//testing code
/*
var users = [
	{name: 'henry', email: 'henry@email.com' }
, {name: 'gio', email: 'giovanni@email.com' }
, {name: 'scott', email: 'isnotalone@email.com' }
, {name: 'denise', email: 'hadababy@email.com' }
, {name: 'rej', email: 'isfun@email.com' }

];
*/





// Routes
app.get('/', routes.index);

app.get('/about', routes.about);

//app.get('/login', routes.login); //removed for now
app.get('/loginfailed', routes.loginfailed);

app.get('/userlist', ensureAuthenticated,  routes.userlist);

app.get('/login', routes.getlogin);

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  routes.postlogin);





app.get('/users', function(req,res){
	res.render('users',{users:users, title: 'USERLIST!!!!!'})
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}




