// Module Dependencies
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var ObjectId = require('mongoose').Types.ObjectId;
var Query = require('mongoose').Query;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var gridfs = require("./gridfs"); //this file should be inside here


// Model includes
var TeacherUsers = require('./models/TeacherUsers');
var Classroom = require('./models/ClassroomSchema');
//var TeacherUsers = mongoose.model('TeacherUserSchema');
var Test = require('./models/Test');
var Question = require('./models/Questions');
var Application = require('./models/UploadFilesTest'); //this was for uploading files, example
var WrongAnswer = require('./models/WrongAnswers');
var Standard = require('./models/Standard');

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
   // console.log('going to authenticate user now 1');
    process.nextTick(function () {
      // console.log('going to authenticate user now 2');
      var messageresult = null;
      TeacherUsers.authenticateEmail(email, password, function(err, user, messageresult){ //before: 'user' was 'email'
        // console.log('returning to user');
        // console.log(messageresult); //this does return the right thing to console
        if(messageresult == 'incorrect user') {return done(null, false, { message: 'Unkown user'});} //left side is the output of the teacher users function, the right side is what is sent to the login page
        if(messageresult == 'wrong password') {return done(null, false, { message: 'Invalid password' });}
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



function GetWholeTeacherUserByID(userinfo, callback){ //name is misleading
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
    });
  }//end of get Teacher User by ID



  function CreateTest(classroom, testname, callback){ //userinfo is actually the tearcherSchema, pageinfo is from post information
    //classroom is the class
    //put variabels into my newly created test
    //console.log('Create Test Data = ' + userinfo.classroom);
    var newTest = new Test({
      TestName: testname,
      ClassName: classroom.ClassName,
      NumberOfStudents: classroom.NumberOfStudents,
      Gradeyear: classroom.Gradeyear,
      Subject: classroom.Subject
    });
    // console.log('new test looks like = ' + newTest)
    //return callback(null,null)
    newTest.save(function(err){
      if(!err){
        //console.log('saved test');
        return callback(null,newTest.id);
      }//end of if err
      else{
        console.log('did not save test');
        console.log(err);
        return callback(err, null);//save error into callback
      }//end of else err
    });//end of save
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
  };//end of startup



  // //create test instance for a specific user
  // exports.CreateTest = function(userinfo, callback){ // this one is no longer used
  //   //put variabels into my newly created test

  //   console.log('create test function received = ' + userinfo)

  //   var newTest = new Test({
  //     TestName: userinfo.TestName,
  //     ClassName: userinfo.ClassName
  //   })
  //   newTest.save(function(err){
  //     if(err){
  //       console.log('did not save test');
  //       return callback(err, null);//save error into callback
  //     }//end of if err
  //     else{
  //       console.log('saved test');
  //       return callback(null,newTest.id);
  //     }//end of else err
  //   })//end of save

  // }//end of CreateTest


//i belive the function below is unsued
  // exports.AddTestToTeacher = function(userinfo, callback){ //seeing if can call a function in here
  //   //userinfo = userID, testID

  //   GetWholeTeacherUserByID(userinfo.userID, function(err,user){
  //     if(!err){
  //       user.ActiveTests.push(userinfo.testID);
  //       user.save(function(saverr){
  //         if(!saverr){console.log('saved objectID in ActiveTests')}
  //         else{console.log('error adding ObjectID into ActiveTests')}
  //       })//end of save
  //     }//end of if
  //     else{

  //     }//end of else
  //   })//end of getwholeteacherUserbyID
  // }//end of AddTestToTeacher




  exports.FindTeacherCreateTestAddAssociateTest = function(pageinfo,callback){ //called from postcreatetest
    //pageinfo  = .userID , .TestName, .ClassName
    //find teacher
    // using selected class name find the correct class
    //creat test and add user variables
    //save test and associate test




    TeacherUsers.findById(pageinfo.userID, ['classroom', 'ActiveTests'], function(err,user){
      if(!err){

        //console.log('returned from search = ' + user.classroom[0].ClassName)
        //console.log('returned from search = ' + user)
        var index = null;
        for(var i = 0; i < user.classroom.length;i++){
           if(pageinfo.ClassName == user.classroom[i].ClassName){
              index = i;
          }
        }//end of for loop
        //console.log('class index = ' + index)
        //callback(null, user)
        CreateTest(user.classroom[index],pageinfo.TestName, function(CTerr, testid){ //with user info ill save test, output is the testID
                //callback(null,testid);//test line
                //console.log('test id = ' + testid)
                if(!CTerr){
                  user.ActiveTests.push(testid);
                  user.save(function(saverr){
                  if(!saverr){
                    //console.log('saved objectID in ActiveTests')
                    callback(null,testid);
                  }
                  else{
                    console.log('error adding ObjectID into ActiveTests');
                    callback(saverr, null);
                  }
                  });//end of save
                }//end of !CTerr if
                else{
                  console.log('error saving test');
                  callback(CTerr, null);
                }//end of !CTerr else
        });//end of Create Test
      }//end of if !err
      else{
        console.log('could not find user');
        callback(err, null);
      }//end of else
    });//end of getwholeteacherUserbyID

  };//end of FindTeacherCreateTestAddAssociateTest



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
  //   TeacherUsers.findById(userinfo, function(err,user){
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







 exports.GetAllTests = function(userinfo, callback){ //userinfo is the Teacher ID
    //find the user
    //find & aggergate every test linked to this user into a variable
    var AllTests = [];
    var testexist = [];
    //console.log('about to enter find teacher')
    TeacherUsers.find({_id: userinfo}, ['ActiveTests']).execFind(function(err, AT) {
      //console.log('going to check if err exists')
      if(!err){
          //console.log('!err hence ill look at each value in AT[0]')
          //console.log('size of AT = ' + AT[0].ActiveTests)
            var size = AT[0].ActiveTests.length;
            //console.log('size of Active Tests array = ' + size)
              if(size != 0){
                  //console.log('size of AT is larger than 0, hence i work normally')
                    if(typeof(AT[0].ActiveTests) != 'undefined'){
                      AT[0].ActiveTests.forEach(function(element) {
                          //console.log('in !err, i guess if found something')
                          //console.warn('active tests element = ' + element)
                          //console.warn('size of AT[0] = ' + AT[0].ActiveTests.length)
                          Test.find({_id: element},['TestName', 'Gradeyear', 'Subject', 'ClassName', 'NumberOfStudents', 'PDFTest', 'CreatedPDF', 'TestGraded']).execFind(function(secerr, atest){ //get only PDFCreated[0].filename ???
                            //console.log('found test = ' + atest)
                            //console.log('pdftest inside = ' + atest[0].PDFTest.length);
                            AllTests.push(atest[0]);
                            //console.warn('size of all tests found = ' + AllTests.length)
                            if(AllTests.length == AT[0].ActiveTests.length){
                              callback(null, AllTests);
                            }
                            if(secerr){ //why is this not an else? (i noticed after i was done doing this)
                              callback(sacerr,null);
                            }
                          });//end second find
                      });//end of ForEach AT[0]
                    }//end of undefined if
                    else{
                      callback('undefined', null);
                    } //end of typeof(AT[0].ActiveTests) != undefiend else
              }//end of AT size check IF
              else{
                console.log('size of AT was zero hence ill return with custome error');
                callback('NoTests', null);
              }
      }//end of if !err
      else{
        console.log('did not find teacher hence ill exit');
        callback(err,null);
      }//end of else
    });//end of find teacherusers
  };//end of GetAllTests









  exports.GetClassInfo =  function(userinfo, callback){ //called from getuserindex
    //userinfo = userid
    TeacherUsers.findById(userinfo,['classroom.ClassName'], function(err,result){
        if(!err){
          //console.log('Found User ID for GetClassInfo');
          //console.log('classes = ' + result.classroom)
          //console.log('result size = ' + result.classroom.length)
          var size = result.classroom.length;
          if(size != 0){
            //console.log('size was not equal to zero')
            callback(null,result.classroom, null);
          }//end of if
          else{
            //console.log('size was equal to zero')
            callback('size of classroom array = 0', null, 'setup');//
          }//end of else
        }//end of !err if
        else {
          console.log('Did not find user '+ userinfo);
          callback(err,null,'nothing');
        }//end of !err else
    });//end of findbyID
  };//end of GetClassInfo










exports.InsertQuestionToTest = function(userinfo, callback){//user put a question into a specific test
  //userinfo.testID
  var newQuestion = new Question({
    Questionhtml: userinfo.QuestionHTML,
    CorrectAnswertext: userinfo.CorrectAnswer,
    Score: userinfo.Score
  });//end of question

  //create wrong answers
  var WA1 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer1});//wrong answer 1
  var WA2 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer2});//wrong answer 2
  var WA3 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer3});//wrong answer 3
  newQuestion.WrongAnswers.push(WA1);
  newQuestion.WrongAnswers.push(WA2);
  newQuestion.WrongAnswers.push(WA3);

  newQuestion.save(function(Qerr){
    if(!Qerr){
      //console.log('Saved Single Question Instance')
      Test.findById(userinfo.testID,function(err,test){
        if(!err){
          test.Questions.push(newQuestion);
          test.save(function(saverr){
            if(!saverr){
              //console.log('saved question to test instance');
              callback(null,test);
            }//end of if !saverr
            else{
              console.log('Failed saving question to test instance');
              callback(saverr, null);
            }//end of else
          });//end of save question to test
        }//end of if !err
        else{
          console.log('Could not find the testID');
          callback(err,null);
        }//end of else
      });//end of test.findbyid
    }
    else{
      console.log('Error Saving Single Question Instance');
      callback(Qerr,null);
    }
  });//end of newQuestion.save
};//end of InsertQuestionToTest







exports.ReturnTestQuestions = function(userinfo, callback){
  //userinfo = req.params.testid

  Test.findById(userinfo, function(err,questions){
    if(!err){
      //console.log('grabed all questions for this test')
      //console.log('questions = ' + questions.Questions)
      // console.log('size of questions = ' + questions.Questions.length);
      if(questions.Questions.length != 0){
          callback(null,questions.Questions);
      }//end of length if
      else{ //if questions.Questions.length == 0
          callback('No Questions Exist!', null);
      }//end of length else
    }//end of !err if
    else{
      console.log('could not find testID');
      callback(err,null);
    }//end of !err else
  });//end of find by id
};//end of ReturnTestQuestions





  // //insert question from the create test page
  // exports.InsertQuestion =  function(userinfo, callback){
  //   var newQuestion = new Question({
  //     Questionhtml: userinfo.QuestionHTML,
  //     CorrectAnswertext: userinfo.CorrectAnswer
  //   })//end of question

  //   //var WrongAnswerSchema = mongoose.model('WrongAnswerSchema').WrongAnswerSchema;
  //   var WA1 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer1})//wrong answer 1
  //   var WA2 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer2})//wrong answer 2
  //   var WA3 = new WrongAnswer({ WrongAnswertext: userinfo.WrongAnswer3})//wrong answer 3
  //    newQuestion.WrongAnswers.push(WA1);
  //    newQuestion.WrongAnswers.push(WA2);
  //    newQuestion.WrongAnswers.push(WA3);

  //   // newQuestion.save(function(err){
  //   //   if(err){
  //   //     console.log('Save Error: NewQuestion');
  //   //     console.log('QHTML = ' + err.errors.Questionhtml)
  //   //     console.log('CAT = ' + err.errors.CorrectAnswertext)
  //   //     //callback(err,done);//return back to the routes index.js with err and done
  //   //   }
  //   //   else
  //   //     console.log('Saved New Question To DB')
  //   // });//end of NewQuestion.Save

  //   var newTest = new Test({
  //     TestName: 'Testing Debug name'
  //   })

  //   newTest.Questions.push(newQuestion);

  //   newTest.save(function(err){
  //     if(err){
  //       console.log('error saving new test');
  //     }
  //     else{
  //       console.log('saved test')
  //     }

  //   })//end of myTestSave


  //   console.log('user id = ' +userinfo.userID )
  //   TeacherUsers.findById(userinfo.userID, function(err,user){
  //       user.Tests.push(newTest);
  //       user.save(function(saveerr){});

  //       if(err){
  //         console.log('DBFUNCTIONS NO USER TO SAVE ');
  //       }
  //       else {
  //         console.log('DBFUNCTIONS found user = ' +  user.email);
  //       }
        
  //   })//end of findbyID

  // } // end of InsertNewQuestion




  exports.DeleteThisTest = function(userinfo, callback){
    //userinfo.testid = test , .userid = userID
    TeacherUsers.findById(userinfo.userid, {'ActiveTests': 1} ,function(err, user){
      if(!err){
        //console.log('found active tests = ' + user)
        //console.log('search for test = ' + userinfo.testtodelete)
        var index = user.ActiveTests.indexOf(userinfo.testtodelete);
        if(index != -1){
          user.ActiveTests.splice(index,1);
          user.save(function(saverr){
            if(!saverr){
              callback(null,user);
            }//end of saverr if
            else{
              console.log('failed to save newly altered Active Tests array');
              callback(saverr,null);
            }//end of saverr else
          });
        }//end of index if
        else{
          console.log('Failed to find the test in Active Tests');
          callback('failed to find test in Active Tests array', null);
        }//end of index if
      }//end of if
      else{
        console.log('failed to find user');
        callback(err,null);
      }//end of else
    });//end of findbyid
  };//end of DeleteThisTest




  exports.SendPDFToGridfs = function(userinfo, callback){
    //userinfo.PDFTest= the file , userinfo.testtoupload

    var opts = {
        content_type: userinfo.PDFTest.type
      };

    Test.findById(userinfo.testtoupload,function(err,test){
      if(!err){
        test.PDFTest.splice(0,1);//remove the old document before storing new one
        test.save(function(saverr1){
          if(!saverr1){
                gridfs.putFile(userinfo.PDFTest.path,userinfo.PDFTest.filename, opts, function(err,result){
                  test.PDFTest.push(result); //should have just grabbed the object id instead of the whole result...
                  test.markModified('PDFTest');
                  test.save(function(saverr){
                      if(!saverr){
                        console.log('saved PDF to this test');
                        return callback(null);
                      }//end of if err
                      else{
                        console.log('did not pdf file');
                        console.log(err);
                        return callback(saverr);//save error into callback
                      }//end of else err
                    });//end of save
                //return callback(null);
                });//end of gridfs putfile
          }//end of first save if
          else{
            return callback(saverr1);
          }//end of first save else
        });//end of first save
      }//end of if !err
      else{
        console.log('Could not find the testID');
        callback(err);
      }//end of else
    });//end of test.findbyid
  };//end of sendpdftogridfs






  exports.SetupAClass = function(userinfo, callback){ //called from postsetup
    //userinfo will have ClassName,Grade, Subject, NumberOfStudents, userid

    //console.log('userinfo userid = ' +userinfo.userid )
    TeacherUsers.findById(userinfo.userid, function(err,teacher){
      if(!err){
        var newclass = new Classroom({
            Subject: userinfo.ClassSubject,
            Gradeyear: userinfo.ClassGrade,
            ClassName: userinfo.ClassName,
            NumberOfStudents: userinfo.NumOfStudents
        });
        teacher.classroom.push(newclass);
        teacher.save(function(saverr){
          if(!saverr){
              //console.log('saved the classroom data')
              callback(null,teacher);
          }//end of !err
          else{
              console.log('Save Error: ClassSetup');
              callback(saverr,null);
          }//end of else
        });//end of user
      }//end of if !err
      else{
        console.log('error finding teacher with id');
        callback(err,null);
      }//end of else !err
    });//end of find by id
  };//end of SetupAClass





exports.EditAClass = function(userinfo, callback){
  //userinfo will have ClassName,Grade, Subject, NumberOfStudents, userid, Edit_Class
  
  var index = null;
  TeacherUsers.findById(userinfo.userid, ['classroom'],function(err,result){
    if(!err){
      //console.log('found the class to edit')
      //console.log('result = ' + result)
      for(var i = 0; i < result.classroom.length; i ++){
        if(result.classroom[i]._id == userinfo.Edit_Class){
          //console.log('found equivalent index = ' + i)
          index = i;
          break;
        }//end of if
      }//end of for loop

      result.classroom[index].ClassName = userinfo.ClassName;
      result.classroom[index].Gradeyear = userinfo.ClassGrade;
      result.classroom[index].Subject = userinfo.ClassSubject;
      result.classroom[index].NumberOfStudents = userinfo.NumOfStudents;

      result.markModified('classroom');

      result.save(function(saverr){
        if(!saverr){
          //console.log('saved item will return now')
          callback(null,result);
        }//end of iff
        else{
          console.log('didnt save item');
          callback(saverr,null);
        }//end of else
      });//end of save function
    }//endof !err
    else{
      console.log('failed to find class to edit');
      callback(err,null);
    }//end of !err else
  });//end of find by id
};//end of EditAClass




exports.GetClasses = function(userinfo, callback){ //for setup class page (getsetup)
//userinfo = userid

  TeacherUsers.findById(userinfo, ['classroom'], function(err,result){
    if(!err){
      //console.log(result);
      callback(null, result.classroom);
    }//end of if !err
    else{
      console.log('failed to find teacher by id');
      callback(err,null);
    }//end of !err else
  });//end of findbyid
};//end of GetClasses




exports.DeleteAClass = function(userinfo, callback){//called from delsetup
//userinfo = userid, classid = setuptodelete
  var index = null;
  TeacherUsers.findById(userinfo.userid, ['classroom'], function(err,result){
      if(!err){
        // console.log('results found = ' + result.classroom)
        // console.log('results size = ' + result.classroom.length)
        for(var i = 0; i < result.classroom.length; i ++){
          if(result.classroom[i]._id == userinfo.setuptodelete){
            // console.log('found equivalent index = ' + i)
            index = i;
            break;
          }//end of if
        }//end of for loop
        console.log('going to remove class name = ' + result.classroom[index].ClassName);
        var theid  = result.classroom[index]._id;
        console.log('going to remove class ID = ' + theid);
        //result.id(theid).remove();
        //result.classroom.remove()

        var idx = result.classroom.indexOf(result.classroom[index]);
        console.log('index of element = '+ idx);
        var oldclass = result.classroom;
        oldclass.splice(idx,1);
        result.classroom = oldclass;


        result.save(function(saverr){
          if(!saverr){
            console.log('saved after removing item');
            callback(null,result);
          }
          else{
            console.log('failed to save item');
            callback(saverr,null);
          }
        });//end of save
      }//end of !err if
      else{
        console.log('didnt find the teacher user');
        callback(err,null);
      }// endof !err else
  });//end of findbyID



};//end of DeleteAClass

exports.getSingleTestStatistics = function(userinfo, callback){ //test statistics
  //userinfo = testobjetid = 4fda1af52f910cc6200000d3


  Test.findById(userinfo,["TRbyQuestions", "Questions", "TRbyStudents"],function(err,result){
    if(!err){
      // var resultbycorrect = [];
      //     // console.log("result = " + result.TRbyQuestions[0].CorrectlyAnswered);
      //     result.TRbyQuestions.forEach(function(element) {
      //           resultbycorrect.push(element.CorrectlyAnswered);
      //           // console.log("num correct = " + element.CorrectlyAnswered);
      //           // console.log("resultbycorrect = " + resultbycorrect.length );
      //           // console.log("result = " + result.TRbyQuestions.length );
      //           if(resultbycorrect.length == result.TRbyQuestions.length){
      //             // console.log("will exit to return");
      //             callback(null, resultbycorrect);
      //           }
      //     });//end of ForEach
      var index = 0;
      result.TRbyQuestions.forEach(function(element) { //need to reduce demial places for STD only
        element.STD = element.STD.toFixed(2);
        index++;
        if(index == result.TRbyQuestions.length ){
          callback(null,result);
        }//end of escape check 
      });//end of foreach TRbyQuestions      
    }//end of !err if

    //   // console.log("found test object")
    //    console.log("result = " + result);
    //   // console.log("Answers = " + result.TestResults[0].numcorrect)
    //   // console.log("result = " + result);
    //   // console.log("result = " + result.id);
    //   callback(null,result.TestResults);
    // }//end of !eer if
    else{
      console.log("did not find test object");
      callback(err,null);
    }//end of !err else
  });//end of findbyid
};//end of getSingleTestStatistics



exports.getMultiTestStatistics = function(userinfo,callback){//self performance
//userinfo=userid
  var AllTests = [];
  var numtestschecked = 0;
  // var theid = "4fda1af52f910cc6200000d3";
    TeacherUsers.find({_id: userinfo}, ['ActiveTests']).execFind(function(err, AT) {
      //console.log('going to check if err exists')
      if(!err){
          //console.log('!err hence ill look at each value in AT[0]')
          //console.log('size of AT = ' + AT[0].ActiveTests)
            var size = AT[0].ActiveTests.length;
            //console.log('size of Active Tests array = ' + size)
              if(size != 0){
                  //console.log('size of AT is larger than 0, hence i work normally')
                    if(typeof(AT[0].ActiveTests) != 'undefined'){
                      AT[0].ActiveTests.forEach(function(element) {
                          //console.log('in !err, i guess if found something')
                          //console.warn('active tests element = ' + element)
                          //console.warn('size of AT[0] = ' + AT[0].ActiveTests.length)
                          Test.find({_id: element},['TestGraded', 'TRbyTest','TestName']).execFind(function(secerr, atest){ //check TestGraded.GradedOn = 1, else do not push
                            //console.log('found test = ' + atest)
                            //console.log('pdftest inside = ' + atest[0].PDFTest.length);
                            // console.log("was graded = " + atest[0].TestGraded.WasGraded);
                            numtestschecked++;
                            if(atest[0].TestGraded.WasGraded == 1){
                                // console.log("std = " + atest[0].TRbyTest.STD.toFixed(2));
                                atest[0].TRbyTest.STD = atest[0].TRbyTest.STD.toFixed(2);
                                AllTests.push(atest[0]);
                            }//checks if it was graded

                            //console.warn('size of all tests found = ' + AllTests.length)
                            if(numtestschecked == AT[0].ActiveTests.length){
                              callback(null, AllTests);
                            }
                            if(secerr){ //why is this not an else? (i noticed after i was done doing this)
                              callback(sacerr,null);
                            }
                          });//end second find
                      });//end of ForEach AT[0]
                    }//end of undefined if
                    else{
                      callback('undefined', null);
                    } //end of typeof(AT[0].ActiveTests) != undefiend else
              }//end of AT size check IF
              else{
                console.log('size of AT was zero hence ill return with custome error');
                callback('NoTests', null);
              }
      }//end of if !err
      else{
        console.log('did not find teacher hence ill exit');
        callback(err,null);
      }//end of else
    });//end of find teacherusers




};//end of graballtests



// exports.grabTestResultstest = function(userinfo, callback){ //removed
//   //userinfo = req.params.testid = 4fda1af52f910cc6200000d3 //testing


//   Test.findById(userinfo,["TRbyQuestions"],function(err,result){
//     if(!err){
//       // var resultbycorrect = [];
//       //     // console.log("result = " + result.TRbyQuestions[0].CorrectlyAnswered);
//       //     result.TRbyQuestions.forEach(function(element) {
//       //           resultbycorrect.push(element.CorrectlyAnswered);
//       //           // console.log("num correct = " + element.CorrectlyAnswered);
//       //           // console.log("resultbycorrect = " + resultbycorrect.length );
//       //           // console.log("result = " + result.TRbyQuestions.length );
//       //           if(resultbycorrect.length == result.TRbyQuestions.length){
//       //             // console.log("will exit to return");
//       //             callback(null, resultbycorrect);
//       //           }
//       //     });//end of ForEach
//       callback(null,result.TRbyQuestions);
//     }//end of !err if

//     //   // console.log("found test object")
//     //    console.log("result = " + result);
//     //   // console.log("Answers = " + result.TestResults[0].numcorrect)
//     //   // console.log("result = " + result);
//     //   // console.log("result = " + result.id);
//     //   callback(null,result.TestResults);
//     // }//end of !eer if
//     else{
//       console.log("did not find test object");
//       callback(err,null);
//     }//end of !err else
//   });//end of findbyid
// };//end of grabTestResults




function reconTestResults(userinfo, callback){ //name is misleading




}//end of get Teacher User by ID










exports.addstandardtoDB = function(userinfo, callback){
//userinfo = req.body

  var newStandard = new Standard({
    Title: userinfo.Title,
    Description: userinfo.Description,
    Headline: userinfo.Headline,
    Subject: userinfo.Subject,
    Abbreviation: userinfo.Abbreviation,
    Topic: userinfo.Topic,
    number: userinfo.Snumber
  });//end of question

  newStandard.save(function(saverr){
    if(!saverr){
      //console.log('saved item will return now')
      callback(null,'saved standard');
    }//end of iff
    else{
      console.log('didnt save standard');
      callback(saverr,null);
    }
  });//end of else
};//addstandardtoDB



exports.addEnglishstandardtoDB = function(userinfo, callback){
//userinfo = req.body

  var subject = new Array();
  // subject[0] = 'English Language Arts';
  // subject[0] = 'Literacy in History/Social Science'
  // subject[0] = 'Science'
  // subject[1] = 'Technical Subjects'
  subject[0] = 'History/Social Science, Sceince and Technical Subjects';
    // console.log('size of subjects = ' + subject.length);

  for(var i = 0; i < subject.length; i++){
    userinfo.subject = subject[i];
    SaveSubject(userinfo,function(err,user){
      // if(!err){

      // }//end of !err if
      // else{

      // }//end of !err else

    });//end of saveSubject
  }//end of for loop



  callback(null, 'test');

};//addstandardtoDB

function SaveSubject(userinfo, callback){ //name is misleading

  // var literacyin = 'Literacy in ' + userinfo.subject;
  // console.log(literacyin);
  var newStandard = new Standard({
    Title: userinfo.Title,
    Description: userinfo.Description,
    Headline: userinfo.Headline,
    Subject: userinfo.subject,
    Abbreviation: userinfo.Abbreviation,
    Topic: userinfo.Topic,
    number: userinfo.Snumber
  });//end of question


  // // console.log('saved standard for = ' + userinfo.subject)
  newStandard.save(function(saverr){
    if(!saverr){
      //console.log('saved item will return now')
      callback(null,'saved standard');
    }//end of iff
    else{
      console.log('didnt save standard = ' + userinfo.subject);
      callback(saverr,null);
    }//end of else
  });//end save


}//end of get Teacher User by ID




































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











