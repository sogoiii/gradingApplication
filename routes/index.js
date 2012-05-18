var mongoose = require("mongoose");
var db = require('../DBfunctions'); //access to the DB and other functions 
var gridfs = require("../gridfs");
var passport = require('passport');
// var check = require('express-validator').check,
//     sanitize = require('express-validator').sanitize
var check = require('validator').check,
    sanitize = require('validator').sanitize

//var scripts = ['javascripts/jQuery.js', 'javascripts/bootstrap.min.js']


/*
 * escape HTML for user input 
 */


function htmlspecialchars(str) {
 if (typeof(str) == "string") {
  str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#039;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  }
 return str;
 }

 function rhtmlspecialchars(str) {
 if (typeof(str) == "string") {
  str = str.replace(/&gt;/ig, ">");
  str = str.replace(/&lt;/ig, "<");
  str = str.replace(/&#039;/g, "'");
  str = str.replace(/&quot;/ig, '"');
  str = str.replace(/&amp;/ig, '&'); /* must do &amp; last */
  }
 return str;
 }



/*
 * Passport functions
 */



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log('the user is not authorized');
  res.redirect('/login');
}








/*
 * GET Static page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home', user: req.user})
};

exports.about = function(req, res){
	res.render('about', { title: 'About'})
};







/*
  
    Loging in and Registering 

*/

exports.getregister = function(req,res){ //add a modal frame of the term of service 
  res.render('register', {title: 'Register', message: req.flash('error')})
}

//add user to the databse...aka register
exports.postregister = function(req,res,next){
  var TeacherUserSchema = mongoose.model('TeacherUserSchema');
    var TeacherUser = new TeacherUserSchema({
    email: req.body.email,
    password: req.body.password
  });

  TeacherUser.save(function (err) {
      if (!err) {
        //console.log('registed user = ' + TeacherUser._id );
        //passport.authenticate('local', { failureRedirect: '/about' , failureFlash: true });
        //ensureAuthenticated
        //res.redirect('/setupclass/' + TeacherUser._id);
        next();
      } else {
        //console.log('err.errors.email = ' + err);
        if(err == 'MongoError: E11000 duplicate key error index: ecomm_database.teacheruserschemas.$email_1  dup key: { : "' + req.body.email +'" }'){
            //console.log('err has the user exists error hence send different message')
            res.render('register', {title: 'Register', message: 'Email exists: please log in'}); //user exists, may not want ot say this,i could be attacked to check who exists in DB.
        
        }
        else{
            //console.log('err has returned and this means the entry was not an email.')
            res.render('register', {title: 'Register', message: 'Not a valid email address'}); //input was not an email
        
        }

      }//end of !err else
   });//end of save

  //must be next: else it redirects to login. This is an ansycn issue, need to find out how to do it sync in this function npm Step?
 // next();
}//end post register

exports.postregister2 = function(req, res){
  res.redirect('/user/' + req.user._id +'/setupclass') //after authentication is done, enter user setupclass 
}//end of post register 2. 



exports.getsetup = function(req,res){
//user will create or edit class information

  db.GetClasses(req.params.id,function(err,results){
    if(!err){
      // console.log('initial = ' + results)
      // console.log('second = ' + results.classroom)
      res.render('setupclass', {title: 'Class Setup', classinfo: results})
    }//end of if
    else{
      res.render('setupclass', {title: 'Class Setup'})
    }//end of else
  })//end of Get Classes
}//end of getsetup


exports.postsetup = function(req,res){ //this is called even for editing a class setup. the only difference would be a an if check which exists here now
  console.log('you called the post version of class setup.')
  //first check if the inputs are valid  
  req.assert('ClassName', 'Class Name can only accepts alphanumeric');//.regex(/^[a-zA-Z0-9 -]$/i); //classname
  req.assert('ClassGrade', 'Class Grade only accepts numbers').isInt(); //grade
  req.assert('ClassSubject', 'Class Subject only accepts alphanumeric ');//.regex(/^[a-zA-Z0-9 -]$/i); //subject
  req.assert('NumOfStudents', 'Number of Students only accepts numbers').isInt(); //grade
  
  var errors = req.validationErrors();
  //console.log('error lenght = ' + errors.length)
  if(errors.length){
    //console.log('errors = ' + errors[0].param);
    // console.log('errors = ' + errors[0].msg);  
    // console.log('errors = ' + errors[0].value);
    res.render('setupclass', {title: "Class Setup", valerrors: errors, message: req.flash('myerror')});
  }//end of if
  else {
  //inputs are valid, hence i can now add them into the DB
  req.body.userid = req.params.id;
    db.SetupAClass(req.body, function(err, result){
      if(!err){
        res.redirect('/user/' + req.params.id)
      }//end of !err
      else{
        res.redirect('/about/'); //temporary line
      }//end of !err else
    })
  }//end of else
}//end of postsetup

exports.putsetup = function(req,res){ //this is called even for editing a class setup. the only difference would be a an if check which exists here now
  console.log('req.body.classroom ID = ' + req.body.Edit_Class);
  console.log('you called the put version of class setup.')

  req.assert('ClassName', 'Class Name can only accepts alphanumeric');//.regex(/^[a-zA-Z0-9 -]$/i); //classname
  req.assert('ClassGrade', 'Class Grade only accepts numbers').isInt(); //grade
  req.assert('ClassSubject', 'Class Subject only accepts alphanumeric ');//.regex(/^[a-zA-Z0-9 -]$/i); //subject
  req.assert('NumOfStudents', 'Number of Students only accepts numbers').isInt(); //grade
  
  var errors = req.validationErrors();
  //console.log('error lenght = ' + errors.length)
  if(errors.length){
    res.render('setupclass', {title: "Class Setup", valerrors: errors, message: req.flash('myerror')});
  }//end of if
  else {
  //inputs are valid, hence i can now add them into the DB
  req.body.userid = req.params.id;
    db.EditAClass(req.body, function(err, result){
      if(!err){
        res.redirect('back');
        //res.redirect('/user/' + req.params.id)
      }//end of !err
      else{
        res.redirect('back');
        //res.redirect('/about/'); //temporary line
      }//end of !err else
    })
  }//end of else


  //res.redirect("back");
}//end of postsetup




exports.delsetup = function(req,res){
//form input is an object id of the classroom embeddeddocument

  console.log('test to delete = ' + req.body.setuptodelete)
  req.body.userid = req.params.id;
  db.DeleteAClass(req.body, function(err, result){
    if(!err){


    }//end !err if
    else{

    }//end of !err else
  })//end of Delete Setup



  res.redirect('back');
}//end of delsetup








exports.getlogin = function(req,res){
	res.render('login', {title: 'Login', user: req.user, message: req.flash('error') });
}//end getlogin

exports.postlogin = function(req, res){ //save session to cookie
  // res.cookie('Firstcookieelement', 'firstcookies yAY!!!!!');

  res.redirect('/user/' + req.user._id);
}//end post login

exports.getlogout = function(req,res){ 
  if(req.user){
    req.session.destroy(function(err){
    console.log('logout user = ' + req.user.id);
    })
  }
  res.redirect('/');
}//end getlogout
















/*
  
    USER OVERVIEW - TESTS - QUESTIONS - STATISTICS

*/

//this is the users start page
exports.getuserindex = function(req,res){ //make this the overview?
  //console.log('req.session.CTE = ' + req.session.CTE);

  db.GetClassInfo(req.params.id,function(err,classinfo){
    if(!err){
      res.render('userindex', {title: 'Overview', TestNameError: req.session.CTE, classinfo: classinfo}); 
    }
    else{
      //do something with inablility to find user
    }
  })//end of GetClassInfo
}//end of getuserhome





/*
 * CREATE TEST
 */


//this route is called to create a test only and redirect to /user/#{userID}/EditTest/#{testID}
exports.postcreatetest = function(req,res) {
  //grab form variables //req.body //if empty reeturn and do not create test
  //create test in DB
  //add the testID to the ActiveTestVariable in TeacherSchema
  //when it returns redirect to the url above.



  req.body.userID = req.params.id; //need to include user ID so to ActiveTests array
  if(!req.body.TestName || req.body.ClassName == 'Select Class'){
      if(!req.body.TestName){req.session.CTE = 'IncludeTestName';}
      //if(!req.body.ClassName){req.session.CTECN = 'IncludeClassName';}
      res.redirect('back'); //
    }//end of req.body.TestName if
  else{
      req.session.CTE = ''; //since testname was included reset the error in the dom.
      req.session.CTCN = ''; //since class name was selected 
      console.log('postcreate = ' + req.body.TestName);
      db.FindTeacherCreateTestAddAssociateTest(req.body, function(err,testid){
        if(!err){
          res.redirect('/user/' + req.params.id + '/edittest/' + testid);
        }
        else{
          res.redirect('/user/' + req.params.id);
        }
      })//end of find teahcer by ID
  }//end of req.body.Testname Else
}//end of postcreatetest


function decodeQuestionHtml(Questions){
  console.log('num of questions = ' + Questions.length);
  for(i = 0; i<Questions.length; i++){
    var QuestionDecoded = sanitize(Questions[i].Questionhtml).entityDecode();
    Questions[i].Questionhtml = QuestionDecoded;
  }//end of for loop
  return Questions
}//end of decodeQuestionHtml



exports.getedittest = function(req,res){ //i know the test ID, i should have associated data to the test already
  //Check test and grab all questions to be displayed
  db.ReturnTestQuestions(req.params.testid, function(err,results){
    if(!err){
      results = decodeQuestionHtml(results); //i encoded the html so i can now decode it. (SERCURITY ISSUE POSSIBLE!!!!)
      res.render('edittest',{title: 'Edit Test', wymeditor: true, message: 'Found Questions: Look Below', Questions: results})
    }//if
    else{
      res.render('edittest',{title: 'Edit Test', wymeditor: true, message: 'Failed to find questions'})
    }//end of else
  });//end of ReturnTestQuestions
}//end of getedittest


exports.putedittest = function(req,res){//user is looking at test and adds questions to test
  //Check all variables exist
  //sanitize and encode variables
  //Create Question and embedd into test

  console.log('inside put edit test!!')
  req.sanitize('QuestionHTML').xss(); //QuestionHTML //NOTE req.body.QuestionHTML seems to be sanitized by wymeditor (MAYBE)
  req.sanitize('QuestionHTML').entityEncode(); //entitiy.Decode() for dispalying later
  req.body.testID = req.params.testid;
  db.InsertQuestionToTest(req.body, function(err,done){ 
    if(!err){
      res.redirect('/user/' + req.params.id +'/edittest/' + req.params.testid);
    }//end of if
    else{
      res.redirect('/user/' + req.params.id +'/edittest/' + req.params.testid);
    }//end of else
  });//end of insertQuestion

}//end of putedittest









exports.getusercreatetest = function(req, res){
    var TeacherUserSchema = mongoose.model('TeacherUserSchema');
    TeacherUserSchema.findById(req.params.id, function(err,user){
      if(err){
        console.log('GET USER error = ' + user.Tests._id); 
        res.render('createtest',{title: 'Create Tests', wymeditor: true, message: 'DID not find user by ID'})
      }        
      else{
        console.log('GET USER no errror = ' + user.Tests._id);
        res.render('createtest',{title: 'Create Tests', wymeditor: true, message: 'User Exists in DB'})
      }
    })//end of findbyID
  //res.render('createtest',{title: 'Create Tests', wymeditor: true})
}





exports.postusercreatetest = function(req, res){
  //req.body.CorrectAnswer QuestionHTML WrongAnswer1,2,3 //user text input names

  // //Remove XSS from user input
  // req.body.QuestionHTML = req.sanitize('QuestionHTML').xss(); //QuestionHTML //NOTE req.body.QuestionHTML seems to be sanitized by wymeditor (MAYBE)
  // //console.log('XSS - QHTML = ' + req.body.QuestionHTML)
  // //encode the now XSS sanitized variable
  // req.body.EncodedQuestionHTML = sanitize(req.body.QuestionHTML).entityEncode(); //entitiy.Decode() for dispalying later
  // console.log('Encoded 1 = ' + req.body.EncodedQuestionHTML);


  //Remove XSS from user input
  req.sanitize('QuestionHTML').xss(); //QuestionHTML //NOTE req.body.QuestionHTML seems to be sanitized by wymeditor (MAYBE)
  //console.log('XSS - QHTML = ' + req.body.QuestionHTML)
  //encode the now XSS sanitized variable
  req.sanitize('QuestionHTML').entityEncode(); //entitiy.Decode() for dispalying later
  //console.log('Encoded 1 = ' + req.body.QuestionHTML);




  // req.assert('CorrectAnswer', 'CorrectAnwer alphanumeric').isAlphanumeric();
  // var errors = req.validationErrors();
  // console.log('error lenght = ' + errors.length)
  // if(errors.length){
  //    console.log('errors = ' + errors[0].param);
  //   // console.log('errors = ' + errors[0].msg);  
  //   // console.log('errors = ' + errors[0].value);
  // }//end of if

  req.body.userID = req.params.id;
  db.InsertQuestion(req.body, function(err,done){ 

  });//end of insertQuestion


  res.redirect('/user/' + req.params.id +'/createtest');
  //res.render('createtest',{title: 'Create Tests', wymeditor: true, message: 'just came from post'})
}







/*
 * GET USER TESTS
 */


exports.getusertests = function(req, res){ //i want this to show all current and older tests 

  db.GetAllTests(req.params.id, function(err, done){
    if(!err){
       //console.log('Done returned');
       console.log('tests function returned = ' + done)
      // console.log(done[1].TestName)
      // console.log(done[2].TestName)
      res.render('usertests',{title: 'Tests', AllTests: done})
    }//end of if
    else{
      console.log('get all tests error')
      res.render('usertests',{title: 'Tests'})
    }//end of else
  })//end of GetAllTests



 // res.render('usertests',{title: 'Tests', wymeditor: true})
}//end get tests


/*
 * DEL Specific USER Test
 */



exports.deltest = function(req,res){
  //testtodelete is the testID that i want to delete. Return back to the original page
  console.log('test to be deleted = ' + req.body.testtodelete)
  req.body.userid = req.params.id;
  db.DeleteThisTest(req.body,function(err,done){
    if(!err){
      //console.log('Deleted items: ' + done)
      res.redirect('back');
    }
    else{
      res.redirect('back');
    }
  })//end of DeleteThisTest

//res.redirect('back')
}//end of deltest






/*
 * GET USER QUESTIONS
 */

exports.getuserquestions = function(req, res){

  res.render('userquestions',{title: 'Questions'})
}//end get questions




/*
 * GET USER STATISTICS
 */

exports.getuserstatistics = function(req, res){

  res.render('userstatistics',{title: 'Statistics'})
}//end get statistics









/*
  
    USER UPLOAD

*/


//test function for uploading to grid fs
exports.getupload = function(req,res){
  Application = mongoose.model("application", ApplicationSchema);
  Application.find({}, function(err, applications) {
      res.render("uploadtest", {
        title: "GridFS Example",
        applications: applications,
        message: req.flash('myerror')
      });
    });

  //res.render('UploadedFiles', {title: 'Upload'})
}


  exports.postupload = function(req,res){
    console.log(req.files.file.type);
    if(req.files.file.type != 'application/pdf'){
      req.flash('myerror', 'wrong file type');
      res.redirect("back"); //back is the upload page 
    }
    else{
      var application, opts;
      application = new Application();
      application.name = req.body.name;
      opts = {
        content_type: req.files.file.type
      };
      application.addFile(req.files.file, opts, function(err, result) {
        req.flash('myerror', 'Thank you for uploading PDF');
        res.redirect("back");
      });
    };//end of else 
    //res.render('upload', {title: 'Register'})
  }

//file link has been clicked ('/file/:id') //this will download file directly
 exports.getshowfile = function(req, res) {
    gridfs.get(req.params.id, function(err, file) {
      res.header("Content-Type", file.type);
      res.header("Content-Disposition", "attachment; filename=" + file.filename);
    });
  };

//works better than above
exports.getshowfile2 = function(req, res){
  gridfs.getnew( function(err,file) {
    res.writeHead('200', {'Content-Type': 'image/png'});
     res.end(file,'binary');
  }, req.params.id );
};















































/*
  
    OLDER TESTING AND LEARNING ROUTES!!! - probably not using anymore or for randome use only!!!

*/


exports.getviewimages = function(req, res){

      res.render("viewimages", {
        title: "View Images"
      });
}




exports.userlist = function(req,res){
  res.render('userlist',{ title: 'Userlist', user: req.user})
};


exports.loginfailed = function(req,res){
  res.render('loginfailed',{ title: 'Loginfailed'})
};


exports.getusers = function(req,res){
  var TeacherUser = mongoose.model('TeacherUserSchema');
  TeacherUser.find({}, function(err, docs){
    res.render('users', {title: 'users' , teachers: docs});
  });
  //res.render('users',{username: username, password: password});
}



exports.getuseroverview = function(req, res){

  res.render('useroverview',{title: 'Overview', userID: req.params.id})
}//end get overview


exports.testajaxpost = function(req,res){ //note to self: if this is from an ajax call, the render or redirect will not work
  console.log('testajax was called from client')
  //console.log('the test id i got was = ' + req.params.data)
  console.log('test i want to delete = ' + req.body.testtodelete)
  //res.render("viewimages", { title: "View Images" });
  res.redirect("back");
}

exports.testajaxpost2 = function(req,res){
  console.log('testajax POST VERSION')
  //res.render("viewimages", { title: "View Images" });
  //res.redirect('/about', { title: 'About'})
}



