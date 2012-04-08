
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
	res.redirect('/');
}



exports.userlist = function(req,res){
	res.render('userlist',{ title: 'Userlist', user: req.user})
};

exports.loginfailed = function(req,res){
	res.render('loginfailed',{ title: 'Loginfailed'})
};