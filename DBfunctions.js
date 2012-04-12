// Module dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

// dependencies for authentication
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var TeacherUsers = require('./models/TeacherUsers');



//Passport Local Strategy
passport.use(new LocalStrategy( 
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      TeacherUsers.findOne({user: username}, function( err, user){
           if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unkown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));

//serialize user login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//deserialize user on logout
passport.deserializeUser(function(id, done) {

  //var TeacherUserSchema = mongoose.model('TeacherUserSchema');
  TeacherUsers.findById(id, function (err, user) {
    done(err, user);
  });
});










