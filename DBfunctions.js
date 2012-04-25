// Module Dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var gridfs = require("./gridfs"); //this file should be inside here 


// Model includes
var TeacherUsers = require('./models/TeacherUsers');
var Application = require('./models/UploadFilesTest');


/*
//Passport Local Strategy for username authentication
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
*/


//Passport Local Strategy for email authentication
passport.use(new LocalStrategy( {usernameField: 'email'},
  function(email, password, done) {
   // asynchronous verification, for effect...
    process.nextTick(function () {
    	var messageresult = new String();
      TeacherUsers.authenticateEmail(email, password, function(err, email, messageresult){
      	console.log(messageresult); //this does return the right thing to console
      	if(messageresult == 'incorrect user') {return done(null, false, { message: 'Unkown user '});}
      	if(messageresult == 'wrong password') {return done(null, false, { message: 'Invalid password' })}
      	return done(err,email);
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
  },//end of startup 






/* //this function only saved the password, and the username is undefined can remove i suppose
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


/*
saveUser: function(userInfo, callback) {
    //console.log(userInfo['fname']);
    var newUser = new TeacherUsers ({
      email: userInfo.email
    , password: userInfo.password
    });

    newUser.save(function(err) {
      if (err) {throw err;}
      //console.log('Name: ' + newUser.name + '\nEmail: ' + newUser.email);
      callback(null, userInfo);
    });
  }
*/


}//end module.exports











