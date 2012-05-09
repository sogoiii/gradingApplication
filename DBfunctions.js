// Module Dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var gridfs = require("./gridfs"); //this file should be inside here 


// Model includes
var TeacherUsers = require('./models/TeacherUsers');
var Test = require('./models/Test');
var Question = require('./models/Questions');
var Application = require('./models/UploadFilesTest'); //this was for uploading files, example


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
      TeacherUsers.authenticateEmail(email, password, function(err, user, messageresult){ //before: 'user' was 'email'
      	console.log(messageresult); //this does return the right thing to console
      	if(messageresult == 'incorrect user') {return done(null, false, { message: 'Unkown user'});} //left side is the output of the teacher users function, the right side is what is sent to the login page
      	if(messageresult == 'wrong password') {return done(null, false, { message: 'Invalid password' })}
      	return done(err,user); //i use to return 'email' not 'user' 
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



function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}













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





  //insert question from the create test page
  InsertQuestion: function(userinfo, callback){

    // console.log('question html IN DB = ' + userinfo.QuestionHTML);
    // console.log('Correct Answer IN DB = ' + userinfo.CorrectAnswer);

    var newQuestion = new Question({
      Questionhtml: userinfo.QuestionHTML,
      CorrectAnswertext: userinfo.CorrectAnswer
    })//end of question

    // var WA1 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer1})//wrong answer 1
    // var WA2 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer2})//wrong answer 2
    // var WA3 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer3})//wrong answer 3
    // newQuestion.WrongAnswers.push(WA1);
    // newQuestion.WrongAnswers.push(WA2);
    // newQuestion.WrongAnswers.push(WA3);

    // newQuestion.save(function(err){
    //   if(err){
    //     console.log('Save Error: NewQuetion');
    //     console.log('QHTML = ' + err.errors.Questionhtml)
    //     console.log('CAT = ' + err.errors.CorrectAnswertext)
    //     //callback(err,done);//return back to the routes index.js with err and done 
    //   }
    //   else
    //     console.log('Saved New Question To DB')
    // });//end of NewQuestion.Save

    var newTest = new Test({
      TestName: 'Testing Debug name'
    })

    newTest.Questions.push(newQuestion);

    newTest.save(function(err){
      if(err){
        console.log('error saving new test');
      }
      else{
        console.log('saved test')
      }

    })//end of myTestSave


    console.log('user id = ' +userinfo.userID )
    TeacherUsers.findById(userinfo.userID, function(err,user){
        user.Tests.push(newTest);
        user.save(function(saveerr){});

        if(err){
          console.log('DBFUNCTIONS NO USER TO SAVE ');
        }
        else {
          console.log('DBFUNCTIONS found user = ' +  user.email);
        }
        
    })//end of findbyID







  }, // end of InsertNewQuestion



































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











