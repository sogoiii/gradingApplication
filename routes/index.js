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
  console.log('req.url = ' + req.url)
  res.render('setupclass', {title: 'Class Setup', userID: req.params.id})
}//end of getsetup


exports.postsetup = function(req,res){

  //first check if the inputs are valid
  // var errors = [];
  // req.onValidationError(function(msg) {
  //     //res.render('signup', { error: msg });
  //     errors.push(msg);
  // });

  // var errors = [];
  // var setError = function(msg) {
  //   console.log('Validation error: ' + msg);
  //   errors.push(msg);
  // }
  // req.onValidationError(setError); //this line must be above the assert
  
  req.assert('ClassName', 'Class Name can only accepts alphanumeric');//.regex(/^[a-zA-Z0-9 -]$/i); //classname
  req.assert('ClassGrade', 'Class Grade only accepts numbers').isInt(); //grade
  req.assert('ClassSubject', 'Class Subject only accepts alphanumeric ');//.regex(/^[a-zA-Z0-9 -]$/i); //subject
  req.assert('NumOfStudents', 'Number of Students only accepts numbers').isInt(); //grade
  

  ////testing validation //the firsrt variable is the name of the field in the jade file
  // //req.check('NumOfStudents', 'Numbers Only').isInt(); //grade //test line
  // // //version 1 //if erros.lenght is unefiend, then i get errors. need to nest it in a check
  var errors = req.validationErrors();
  console.log('error lenght = ' + errors.length)
  if(errors.length){
     console.log('errors = ' + errors[0].param);
    // console.log('errors = ' + errors[0].msg);  
    // console.log('errors = ' + errors[0].value);
    res.render('setupclass', {
        title: "Class Setup",
        valerrors: errors,
        message: req.flash('myerror')
      });
  }//end of if


  // //version 2 
  // var mappedErrors = req.validationErrors(true);
  // console.log('error lenght = ' + mappedErrors.length)
  // if(mappedErrors.length){
  //   console.log('errors = ' + mappedErrors.NumOfStudents.param);
  //   console.log('errors = ' + mappedErrors.NumOfStudents.msg);  
  //   console.log('errors = ' + mappedErrors.NumOfStudents.value);
  //   res.render('setupclass', {
  //       title: "Class Setup",
  //       classes: user,
  //       userID: req.params.id,
  //       message: req.flash('myerror')
  //     });

  // }//end of if





  else {
  //inputs are valid, hence i can now add them into the DB
  var TeacherUserSchema = mongoose.model('TeacherUserSchema');
  TeacherUserSchema.findById(req.params.id, function(err, user) {
        //making my modifications/updates to the document found
        user.classroom.subject = req.body.ClassSubject;
        user.classroom.gradeyear = req.body.ClassGrade;
        user.classroom.classname = req.body.ClassName;
        user.classroom.numofstudents = req.body.NumOfStudents;
        //save the changes and get errors
        user.save(function(err){
          if(err)
              console.log('Save Error: ClassSetup = ' + req.params.id)
          else
              console.log('saved the classroom data')
        });//end of save

        res.render('setupclass', {
        title: "Class Setup",
        classes: user,
        message: req.flash('myerror')
      });
    });//end of findby ID

  }//end of else

  //res.render('setupclass', {title: 'Class Setup', userID: req.params.id})
}//end of postsetup



exports.getlogin = function(req,res){
	res.render('login', {title: 'Login', user: req.user, message: req.flash('error') });
}

exports.postlogin = function(req, res){ //save session to cookie
  // res.cookie('Firstcookieelement', 'firstcookies yAY!!!!!');
  //console.log(req.session.email);
/*req.session.loggedIn = true;
if(req.session){
  console.log('the session.user exists!!!');
}
else{
  console.log('no session for login');
}

  console.log('session.passport.user = ' + req.session.passport.user);
  console.log('session.lastAccess = ' + req.session.lastAccess);
  console.log('req.user.id = ' + req.user.id);
  req.session.useremail = req.user.email;
  //grab the user.websiteaccount
  console.log('Session ID = ' + req.session.id);*/
  //redirect to their homepage with variables 
  //console.log('already updaded session with logged in true');
  res.redirect('/user/' + req.user._id);
  //res.render('userindex',{title: 'Logged into user'});
}

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
  //if(req.session.loggedIn == true){

    console.log('objectID aka userID = ' + req.user._id);//undefined since i never put anything in there
    console.log('User email = ' + req.user.email);
    req.session.user = 'user email access is = ' + req.user.email; //temporary line, only for debugging remove once in production

    console.log('URL id = ' + req.params.id);
  var TeacherUserSchema = mongoose.model('TeacherUserSchema');
  TeacherUserSchema.findById(req.params.id, function(err, user) {
    if(!err){
      var classinfo = user.classroom;
      console.log('found the user!');
          res.render('userindex', {title: 'Overview', 
                             username: req.session.user,
                             classinfo: classinfo}); //username: is a debug variable, this will have to be removed too.


    }//end of !err if
    else{
      console.log('did not find user?!');
          res.render('userindex', {title: 'Overview', 
                             username: req.session.user}); //username: is a debug variable, this will have to be removed too.


    }//end of !err else
  });//end of findByID


    // res.render('userindex', {title: 'Overview', 
    //                          username: req.session.user
    //                          classinfo: classinfo}); //username: is a debug variable, this will have to be removed too.
  



//  }//end of session logged in 
  //else{
   // console.log('User Is not Logged in, hence will be booted');
   // res.redirect('/');
 // }//end of else 

}//end of getuserhome










/*
 * CREATE TESTS
 */



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


exports.getusertests = function(req, res){
  res.render('usertests',{title: 'Tests', wymeditor: true})
}//end get tests





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





