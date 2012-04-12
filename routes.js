var passport = require('passport');

var routes = require('./routes/index');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
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
  passport.authenticate('local', { successRedirect: '/userlist', 
  	                               failureRedirect: '/login' ,
  	                            failureFlash: true })
);


app.get('/users', routes.getusers);




}




