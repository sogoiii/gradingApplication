var passport = require('passport');

var routes = require('./routes/index');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function RestirctAccess(req,res,next){
	req.session.loggedIn = true; //can only get to this function if this is true
	//req.session.passport.user
	//console.log('RA: session.passport.user = ' + req.session.passport.user);
	//console.log('RA: req.param.id = ' + req.params.id);
	//console.log('RA: req.user.id = ' + req.user.id);

	if(req.params.id == req.session.passport.user){//if authen
		next();
	}
	else{
		res.redirect('/loginfailed');
	}
}



module.exports = function(app) {


// Routes
app.get('/', routes.index);

app.get('/about', routes.about);

app.get('/register', routes.getregister);

app.post('/register', routes.postregister); 

app.get('/loginfailed', routes.loginfailed);

app.get('/userlist', ensureAuthenticated,  routes.userlist);

app.get('/login', routes.getlogin);

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }),
  routes.postlogin
);

app.get('/logout', routes.getlogout);


app.get('/users', routes.getusers); //test version





/*
  
    USER OVERVIEW - TESTS - QUESTIONS - STATISTICS

*/

app.get('/user/:id', ensureAuthenticated, RestirctAccess, routes.getuserindex);

app.get('/user/:id/overview', ensureAuthenticated, RestirctAccess, routes.getuseroverview);

app.get('/user/:id/tests', ensureAuthenticated, RestirctAccess, routes.getusertests);

app.get('/user/:id/questions', ensureAuthenticated, RestirctAccess, routes.getuserquestions);

app.get('/user/:id/statistics', ensureAuthenticated, RestirctAccess, routes.getuserstatistics);




/*
  
    USER UPLOADING

*/



//uploading a file examples
app.get('/uploadtest', routes.getupload);
app.post('/uploadnew',routes.postupload);
app.get('/file/:id', routes.getshowfile2)

app.get('/viewimages', routes.getviewimages);



}




