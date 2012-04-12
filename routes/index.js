var mongoose = require("mongoose");
//var TeacherUserSchema = mongoose.model('TeacherUserSchema');


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

    var TeacherUserSchema = mongoose.model('TeacherUserSchema');
	  var TeacherUser = new TeacherUserSchema({
		user: req.body.username,
		password: req.body.password
	});

/*
    var Document = mongoose.model('TeacherUserSchema');
    var TeacherUser = new Document();
    TeacherUser.user = req.body.username; //right is from the website, left is the mongodb Schema
    TeacherUser.password = req.body.password;
*/


    TeacherUser.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  //});
  });

   // res.send(TeacherUser);
	res.redirect('/userlist');
}


exports.userlist = function(req,res){
	res.render('userlist',{ title: 'Userlist', user: req.user})
};

exports.loginfailed = function(req,res){
	res.render('loginfailed',{ title: 'Loginfailed'})
};


