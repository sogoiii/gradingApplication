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
var WrongAnswer = require('./models/WrongAnswers');


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



function GetWholeTeacherUserByID(userinfo, callback){
    //userinfo = userid
    TeacherUsers.findById(userinfo, function(err,user){
      if(!err){
        //console.log('foundnd user '+ userinfo);
        return callback(null,user);
      }//end of if
      else {
        //console.log('did not find user');
        return callback(err,null);
      }//end of else
    })
  }//end of get Teacher User by ID



  function CreateTest(userinfo, pageinfo, callback){ //userinfo is actually the tearcherSchema, pageinfo is from post information
    //put variabels into my newly created test
    console.log('Create Test = ' + pageinfo.TestName);
    var newTest = new Test({
      TestName: pageinfo.TestName,
      Class: userinfo.classroom.classname,
      NumberOfStudents: userinfo.classroom.numofstudents,
      Gradeyear: userinfo.classroom.gradeyear,
      Subject: userinfo.classroom.subject
    })
    newTest.save(function(err){
      if(err){
        console.log('did not save test');
        console.log(err);
        return callback(err, null);//save error into callback 
      }//end of if err
      else{
        console.log('saved test');
        return callback(null,newTest.id);
      }//end of else err
    })//end of save

  }//end of CreateTest



//export DB functions ADD BELOW
//module.exports = {

  // initialize DB
  exports.startup = function(dbToUse) {
    mongoose.connect(dbToUse);
    // Check connection to mongoDB
    mongoose.connection.on('open', function() {
      console.log('We have connected to mongodb');
    }); 
  }//end of startup 



  //create test instance for a specific user 
  exports.CreateTest = function(userinfo, callback){
    //put variabels into my newly created test
    var newTest = new Test({
      TestName: userinfo.TestName,
      Class: userinfo.ClassName
    })
    newTest.save(function(err){
      if(err){
        console.log('did not save test');
        return callback(err, null);//save error into callback 
      }//end of if err
      else{
        console.log('saved test');
        return callback(null,newTest.id);
      }//end of else err
    })//end of save

  }//end of CreateTest


  exports.AddTestToTeacher = function(userinfo, callback){ //seeing if can call a function in here
    //userinfo = userID, testID

    GetWholeTeacherUserByID(userinfo.userID, function(err,user){
      if(!err){
        user.ActiveTests.push(userinfo.testID);
        user.save(function(saverr){
          if(!saverr){console.log('saved objectID in ActiveTests')}
          else{console.log('error adding ObjectID into ActiveTests')}  
        })//end of save
      }//end of if
      else{

      }//end of else
    })//end of getwholeteacherUserbyID
  }//end of AddTestToTeacher




  exports.FindTeacherCreateTestAddAssociateTest = function(pageinfo,callback){ //Ill just keep it as two functions for now
    //find teacher
    //creat test and add user variables
    //save test and associate test

    GetWholeTeacherUserByID(pageinfo.userID, function(err,user){
      if(!err){
        CreateTest(user,pageinfo, function(CTerr, testid){ //with user info ill save test, output is the testID
          if(!CTerr){
            user.ActiveTests.push(testid);
            user.save(function(saverr){
            if(!saverr){console.log('saved objectID in ActiveTests')}
              else{console.log('error adding ObjectID into ActiveTests')}  
            })//end of save
          }//end of !CTerr
          else{console.log('error saving test')}
        })//end of Create Test
      }//end of if !err
      else{

      }//end of else
    })//end of getwholeteacherUserbyID

  }//end of FindTeacherCreateTestAddAssociateTest



  // exports.AddTestToTeacher = function(userinfo, callback){//intermediate functions //for testing purposes
  //   astring = 'whats up in here?'
  //   var outstring = htmlspecialchars(astring);
  //   TeacherUsers.findById(userinfo.userID, function(err,user){
  //     if(!err){
  //       user.ActiveTests.push(userinfo.testID)
  //       user.save(function(saverr){
  //         if(!saverr){
  //             console.log('saved test to user')
  //         }
  //         else{
  //             console.log('failed to save test to user')
  //         }
  //       console.log('found user')

  //       })//end of save
  //       //return callback(null,user);
  //     }//end of if
  //     else {
  //       console.log('Failed to find user');
  //       //return callback(err,null);
  //     }//end of else
  //   })

  // }//end testtoteacher



  // exports.GetWholeTeacherUserByID = function(userinfo, callback){
  //   //userinfo = userid
  //   TeacherUsers.findByID(userinfo, function(err,user){
  //     if(!err){
  //       //console.log('Did not find user '+ userinfo);
  //       return callback(null,user);
  //     }//end of if
  //     else {
  //       //console.log('Found User ID for GetClassInfo');
  //       return callback(err,null);
  //     }//end of else
  //   })
  // }//end of get Teacher User by ID




  exports.GetClassInfo =  function(userinfo, callback){
    TeacherUsers.findById(userinfo, function(err,user){
        if(err){
          console.log('Did not find user '+ userinfo);
          return callback(err,null);
        }
        else {
          //console.log('Found User ID for GetClassInfo');
          return callback(null,user.classroom);
        }
    })//end of findbyID
  }//end of GetClassInfo




exports.InsertQuestionToTest = function(userinfo, callback){//user put a question into a specific test
  //userinfo.testID 
  var newQuestion = new Question({
    Questionhtml: userinfo.QuestionHTML,
    CorrectAnswertext: userinfo.CorrectAnswer
  })//end of question

  //create wrong answers
  var WA1 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer1})//wrong answer 1
  var WA2 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer2})//wrong answer 2
  var WA3 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer3})//wrong answer 3
  newQuestion.WrongAnswers.push(WA1);
  newQuestion.WrongAnswers.push(WA2);
  newQuestion.WrongAnswers.push(WA3);

  newQuestion.save(function(Qerr){
    if(!Qerr){
      console.log('Saved Single Question Instance')
      Test.findById(userinfo.testID,function(err,test){
        if(!err){
          test.Questions.push(newQuestion);
          test.save(function(saverr){
            if(!saverr){
              console.log('saved question to test instance');
              callback(null,test);
            }//end of if !saverr
            else{
              callback(saverr, null);
              console.log('Failed saving question to test instance');
            }//end of else
          })//end of save question to test
        }//end of if !err
        else{
          callback(err,null);
          console.log('Could not find the testID');
        }//end of else
      })//end of test.findbyid
    }
    else{
      callback(Qerr,null);
      console.log('Error Saving Single Question Instance')
    }
  })//end of newQuestion.save


}//end of InsertQuestionToTest





exports.ReturnTestQuestions = function(userinfo, callback){
  //userinfo = req.params.testid

  Test.findById(userinfo, function(err,questions){
    if(!err){
      console.log('grabed all questions for this test')
      //console.log('questions = ' + questions.Questions)
      callback(null,questions.Questions);
    }//end of if
    else{
      console.log('could not find testID')
      callback(err,null);
    }//end of else
  })//end of find by id
}//end of ReturnTestQuestions





  //insert question from the create test page
  exports.InsertQuestion =  function(userinfo, callback){
    var newQuestion = new Question({
      Questionhtml: userinfo.QuestionHTML,
      CorrectAnswertext: userinfo.CorrectAnswer
    })//end of question

    //var WrongAnswerSchema = mongoose.model('WrongAnswerSchema').WrongAnswerSchema;
    var WA1 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer1})//wrong answer 1
    var WA2 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer2})//wrong answer 2
    var WA3 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer3})//wrong answer 3
     newQuestion.WrongAnswers.push(WA1);
     newQuestion.WrongAnswers.push(WA2);
     newQuestion.WrongAnswers.push(WA3);

    // newQuestion.save(function(err){
    //   if(err){
    //     console.log('Save Error: NewQuestion');
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

  } // end of InsertNewQuestion



































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


//}//end module.exports











