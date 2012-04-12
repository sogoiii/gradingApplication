// Module Dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;


// Model includes
var TeacherUsers = require('./models/TeacherUsers')


//Passport Local Strategy
passport.use(new LocalStrategy( 
  function(user, password, done) {
   // asynchronous verification, for effect...
    process.nextTick(function () {
      TeacherUsers.authenticate(user, password, function(err, user){
      	return done(err,user);
      });//end authenticate
    });
  }//end username password done 
));

//serialize user login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//deserialize user on logout
passport.deserializeUser(function(id, done) {
  TeacherUsers.findById(id, function (err, user) {
    done(err, user);
  });
});



//export DB functions ADD BELOW
module.exports = {

  // initialize DB
  startup: function(dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function() {
      console.log('We have connected to mongodb');
    }); 
  }, //end of startup 






/* //this function only saved the password, and the username is undefined 
  //save Teacher User to DB
  SaveTeacherUser: function(userinfo,callback){
  	  //create Teacher User Variables
  	  //var TeacherUserSchema = mongoose.model('TeacherUserSchema');

console.log("user = " + userinfo.username);
console.log("password = " + userinfo.password);

	  var newTeacher = new TeacherUsers({
      user: userinfo.username,
	  password: userinfo.password
	  });

	  console.log("newTeacher  = " + newTeacher.username);
console.log("newTeacher password = " + newTeacher.password);
      //Save TeacherUser Variables to DB
      newTeacher.save(function (err) {
        if (!err) {
        	callback(null,userinfo);
            //return console.log("created");
        } else {
        	throw err;
            //return console.log(err);
        }
      });
  }//end saveTeacheruser
*/







}//end module.exports











