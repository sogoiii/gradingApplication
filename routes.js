var passport = require('passport');

var routes = require('./routes/index');


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log('the user is not Authenticated');
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

/*
  
    GET Static page.

*/
app.get('/', routes.index);
app.get('/about', routes.about);





/*
  
    Loging in and Registering 

*/


app.get('/register', routes.getregister);
app.post('/register', routes.postregister, passport.authenticate('local', { failureRedirect: '/register' , failureFlash: true }), routes.postregister2); 

app.get('/login', routes.getlogin);
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }),
  routes.postlogin
);
app.get('/logout', routes.getlogout);








/*
  
    USER OVERVIEW - TESTS - QUESTIONS - STATISTICS

*/
app.get('/user/:id/setupclass', ensureAuthenticated, RestirctAccess, routes.getsetup)
app.post('/user/:id/setupclass', ensureAuthenticated, RestirctAccess, routes.postsetup) //put and post are nearly identical.
app.put('/user/:id/setupclass',ensureAuthenticated, RestirctAccess, routes.putsetup) //put and post are nearly identical.
app.del('/user/:id/setupclass',ensureAuthenticated, RestirctAccess, routes.delsetup )

app.get('/user/:id', ensureAuthenticated, RestirctAccess, routes.getuserindex);

app.post('/user/:id/createtest', ensureAuthenticated, RestirctAccess, routes.postcreatetest);
app.get('/user/:id/edittest/:testid', ensureAuthenticated, RestirctAccess, routes.getedittest);
app.put('/user/:id/edittest/:testid', ensureAuthenticated, RestirctAccess, routes.putedittest);
app.del('/user/:id/testdelete/:testid', ensureAuthenticated, RestirctAccess, routes.deltest);

// app.get('/user/:id/createtest', ensureAuthenticated, RestirctAccess, routes.getusercreatetest);
// app.post('/user/:id/createtest', ensureAuthenticated, RestirctAccess, routes.postusercreatetest);


app.get('/user/:id/tests', ensureAuthenticated, RestirctAccess, routes.getusertests);
app.post('user/:id/tests', ensureAuthenticated, RestirctAccess, routes.postusertests);
app.get('/user/:id/questions', ensureAuthenticated, RestirctAccess, routes.getuserquestions);
app.get('/user/:id/statistics', ensureAuthenticated, RestirctAccess, routes.getuserstatistics);







/*
  
    USER UPLOADING

*/

//uploading a file examples
app.get('/uploadtest', routes.getupload);
app.post('/uploadnew',routes.postupload);
app.get('/file/:id', routes.getshowfile2)








/*
  
    OLDER TESTING AND LEARNING ROUTES!!! - probably not using anymore or for randome use only!!!

*/

app.get('/viewimages', routes.getviewimages);
app.get('/users', routes.getusers); //test version
app.get('/loginfailed', routes.loginfailed);
app.get('/userlist', ensureAuthenticated,  routes.userlist);
app.get('/user/:id/overview', ensureAuthenticated, RestirctAccess, routes.getuseroverview);

app.del('/user/testajaxpost', routes.testajaxpost)
app.post('/user/testajaxpost', routes.testajaxpost2)



}




