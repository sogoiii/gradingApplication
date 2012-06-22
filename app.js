
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

var amqp = require('amqp');
var rabbitMQ = amqp.createConnection({ host: '127.0.0.1' });
var rpc = new (require('./amqprpc'))(rabbitMQ);


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
var io = require('socket.io').listen(app);

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







/*


SOCKET IO STUFF!!!


*/


io.set('log level', 1); 
io.sockets.on('connection', function (socket) {


  //this function is called from the browser
  socket.on('RPC_request', function (data){
    console.log('Received request to send an RPC Command');
      rpc.makeRequest('image', data, function response(err, response){
        if(err)
          console.error('error = ' + err);
        else{
          socket.emit('RPC_response', 'the RPC function has returned go check statistics page');  
          //console.log("response = '" + response.data + "' is of type = '" + response.contentType+"'");
          console.log("response = '" + response.data + "' To browser = '" + response.data.cool);
        }
      });//end of rpc.makerequest
  })//end of RPC_request


  //this function is called for creating a pdf file
  socket.on('RPC_PrintPDF', function(data){
    console.log('recieved request to create pdf')
    rpc.makeRequest('createPDF', data, function response(err,response){
      if(!err){
        console.log('Returned from java')
        response.createdid = response.data;
        var out = response.createdid.toString();
        console.log('response = ' + out);
        response.textreply = 'Click the download button';
        socket.emit('RPC_Print_response', out)
      }//end of if
      else{
        console.log('Failed RPC')

      }//end of else
    })//end of rpc.makerequest
  })//end of socket.on

  socket.on("BuildStats_req", function(data,fn){

    console.log("recived request to build chart!")
    var cool = "1";
    DB.grabTestResultstest(cool, function(err,result){
      if(!err){
        // console.log("Results = " + result)

        socket.emit("BuildStats_res",result);
      }//end of !err if
      else{
        console.log("No results " )


      }//end of !err else
    })//end of grabTestResults



    socket.on("getresults", function(data,fn){
      console.log('data from client= ' + data);
      var cool = "1"; 
      DB.grabTestResultstest(cool, function(err,result){
        if(!err){
          // console.log("Results = " + result)
          fn(result)
        }//end of !err if
        else{
          console.log("No results ")
          fn('woot')
        }//end of !err else
      })//end of grabTestResults
    })





  })//end of buildstats socket.on


});//end of socket.io



















app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);