var mongoose = require("mongoose");
var db = require('../DBfunctions'); //access to the DB and other functions 

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

exports.userlist = function(req,res){
	res.render('userlist',{ title: 'Userlist', user: req.user})
};

exports.loginfailed = function(req,res){
	res.render('loginfailed',{ title: 'Loginfailed'})
};


exports.getregister = function(req,res){
  console.log("get Rigister Page");
  res.render('Register', {title: 'Register'})
}



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

/*//below we can call the function but the username becomes undefined 
console.log("user = " + req.body.username);
console.log("password = " + req.body.password);

  db.SaveTeacherUser({
    user: req.body.username,
    password: req.body.password
  },
  function(err,docs){
    res.redirect('/userlist');
  });
*/
}//end post register


exports.getusers = function(req,res){
  var TeacherUser = mongoose.model('TeacherUserSchema');
  TeacherUser.find({}, function(err, docs){
    res.render('users', {title: 'users' , teachers: docs});
  });
  //res.render('users',{username: username, password: password});
}




