
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , util = require('util')
  , fs = require('fs');

var expressValidator = require('express-validator');


var gridfs = require("./gridfs"); //this line may not be required here   

var mongoose = require('mongoose');
var mongoStore = require('session-mongoose');
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);




var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var DB = require('./DBfunctions');


//load all the model files for mongoose(Mongodb) 
var models_path = __dirname + '/models'
var model_files = fs.readdirSync(models_path)
model_files.forEach(function(file){
    require(models_path+'/'+file)
});


var app = module.exports = express.createServer();


//Database
var dbloc = 'mongodb://localhost/ecomm_database';
mongoose.connect(dbloc);



// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set(express.logger());
  app.use(express.cookieParser());
  //app.use(express.limit('2mb')); //limit file accepted here for testing only
  app.use(express.bodyParser());
  app.use(expressValidator);
  app.use(express.methodOverride());


    var mongooseSessionStore = new mongoStore({
      url: "mongodb://localhost/mv",
      interval: 3600000 
  });


  app.use(express.session( {cookie: {maxAge: 3600000}, store: mongooseSessionStore, secret: "mv secret" }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/*
app.dynamicHelpers({
  scripts: function(req, res){
    return ['javascripts/jQuery.js', 'javascripts/bootstrap.min.js'];
  }
});

app.helpers({
  name: function(first, last){ return first + ', ' + last }
  , firstName: 'javascripts/jQuery.js'
  , lastName: 'javascripts/bootstrap.min.js'
});

*/

app.helpers({
  renderScriptsTags: function (all) {
    if (all != undefined) {
      return all.map(function(script) {
        return '<script src="/javascripts/' + script + '"></script>';
      }).join('\n ');
    }
  }
});

app.dynamicHelpers({
  myscripts: function() {
      //scripts to load on every page
      //return ['jQuery.js','wymeditor/jquery.wymeditor.min.js' ,'bootstrap.min.js'];
      return ['jQuery.js','bootstrap.js'];
      //return ['jQuery.js','bootstrap.min.js'];
  }
});

app.dynamicHelpers({
  DynsessionLoggedIn: function(req,res) {
      return req.session.loggedIn;
  }
});


app.dynamicHelpers({
  userID: function(req,res) {
      return req.params.id;
  }
});





var db = new DB.startup(dbloc);


//Load all the route files 
var controllers_path = __dirname + '/routes'
var controller_files = fs.readdirSync(controllers_path)
controller_files.forEach(function(file){
  require(controllers_path+'/'+file)
});


require('./routes')(app);



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

/*this function is not used here, its in routes.js*/
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log('the user is not authorized');
  res.redirect('/login')
}




