
var mongoose = require("mongoose");
//var TeacherUserModel = mongoose.model('TeacherUsers', TeacherUsers);


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

exports.postlogin = function(req,res){ //post
	//function(req,res){ 
    var Document = mongoose.model('TeacherUserSchema');
    var TeacherUser = new Document();
    TeacherUser.user = req.body.user;
    TeacherUser.password = req.body.password;

/*
    TeacherUserSchema = new TeacherUserModel({
      user: req.body.user,
      password: req.body.password
    });*/



    TeacherUser.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  //});
  });

    res.send(TeacherUser);
	res.redirect('/');
}


exports.userlist = function(req,res){
	res.render('userlist',{ title: 'Userlist', user: req.user})
};

exports.loginfailed = function(req,res){
	res.render('loginfailed',{ title: 'Loginfailed'})
};


