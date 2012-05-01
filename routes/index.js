var mongoose = require("mongoose");
var db = require('../DBfunctions'); //access to the DB and other functions 
var gridfs = require("../gridfs");

//var scripts = ['javascripts/jQuery.js', 'javascripts/bootstrap.min.js']


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home', user: req.user})
};

exports.about = function(req, res){
	res.render('about', { title: 'About'})
};

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


exports.userlist = function(req,res){
	res.render('userlist',{ title: 'Userlist', user: req.user})
};

exports.loginfailed = function(req,res){
	res.render('loginfailed',{ title: 'Loginfailed'})
};


exports.getregister = function(req,res){ //add a modal frame of the term of service 
  res.render('register', {title: 'Register', message: req.flash('error')})
}





/*
  
    USER OVERVIEW - TESTS - QUESTIONS - STATISTICS

*/

//this is the users start page
exports.getuserindex = function(req,res){ //make this the overview?

  //console.log('user session authenitcated = ' + req.session.loggedIn);
 // console.log('user session email = ' + req.session.useremail)

  if(req.session.loggedIn == true){

    console.log('objectID aka userID = ' + req.user._id);//undefined since i never put anything in there
    console.log('User email = ' + req.user.email);
    req.session.user = 'user email access is = ' + req.user.email;
    var sess = req.sessions;
    //sess.id = req.params.id;
    console.log('URL id = ' + req.params.id);
    //console.log(sess.id + ' = session id');
    //req.sessions.id = req.params.id;
    res.render('userindex', {title: 'UserHome', 
                             username: req.session.user,
                             userID: req.params.id});
  }
  else{
    console.log('User Is not Logged in, hence will be booted');
    res.redirect('/');
  } 

}//end of getuserhome


exports.getuseroverview = function(req, res){

  res.render('useroverview',{title: 'Overview', userID: req.params.id})
}//end get overview


exports.getusertests = function(req, res){

  res.render('usertests',{title: 'Tests', userID: req.params.id})
}//end get tests


exports.getuserquestions = function(req, res){

  res.render('userquestions',{title: 'Questions', userID: req.params.id})
}//end get questions


exports.getuserstatistics = function(req, res){

  res.render('userstatistics',{title: 'Statistics', userID: req.params.id})
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



exports.getviewimages = function(req, res){

      res.render("viewimages", {
        title: "View Images"
      });
}




/* //older post register, coudl remove
exports.postregister = function(req,res){
  var TeacherUserSchema = mongoose.model('TeacherUserSchema');
    var TeacherUser = new TeacherUserSchema({
    user: req.body.username,
    password: req.body.password
  });
//console.log("going to save to mongodb now!");
TeacherUser.save(function (err) {
    if (!err) {
      return console.log("created user");
    } else {
      return console.log("not CREATED!!!!!");
    }

 });
res.redirect('/about'); 

//below we can call the function but the username becomes undefined 
console.log("user = " + req.body.username);
console.log("password = " + req.body.password);

  db.SaveTeacherUser({
    user: req.body.username,
    password: req.body.password
  },
  function(err,docs){
    res.redirect('/userlist');
  });

}//end post register
*/



//add user to the databse...aka register
exports.postregister = function(req,res){
  var TeacherUserSchema = mongoose.model('TeacherUserSchema');
    var TeacherUser = new TeacherUserSchema({
    email: req.body.email,
    password: req.body.password
  });

TeacherUser.save(function (err) {
    if (!err) {
      res.render('index', { title: 'Home', user: req.user});
      //return console.log("created user");
    } else {
      res.render('register', {title: 'Register', message: 'Not an Email Address'});
      //return console.log("not CREATED!!!!!");
    }
 });
}//end post register



/* //working btu i do not like the throw
exports.postregister = function(req,res){
  db.saveUser({
      email : req.body.email
    , password : req.body.password
    }, function(err,docs) {
      res.redirect('/about');
    });
}//end post register
*/










exports.getusers = function(req,res){
  var TeacherUser = mongoose.model('TeacherUserSchema');
  TeacherUser.find({}, function(err, docs){
    res.render('users', {title: 'users' , teachers: docs});
  });
  //res.render('users',{username: username, password: password});
}




