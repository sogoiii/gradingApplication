
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');



var gridfs = require("./gridfs"); //this line may not be required here

var mongoose = require('mongoose');
var mongoStore = require('session-mongoose');


var amqp = require('amqp');
var rabbitMQ = amqp.createConnection({ host: '127.0.0.1' });
// var rpc = new (require('./amqprpc'))(rabbitMQ);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var DB = require('./DBfunctions');


var dbloc = 'mongodb://localhost/ecomm_database';
mongoose.connect(dbloc);

var port = process.env.PORT || 5000;
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(port);


// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
// var db = new DB.startup(dbloc);

//v1
// app.get('/', function(req, res){
//   res.render('index', { title: 'Express' });
// });

//v2
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
app.get('/user/:id/setupclass', routes.getsetup);
app.post('/user/:id/setupclass',  routes.postsetup);//put and post are nearly identical.
app.put('/user/:id/setupclass', routes.putsetup); //put and post are nearly identical.
app.del('/user/:id/setupclass', routes.delsetup );

app.get('/user/:id',  routes.getuserindex);

app.post('/user/:id/createtest',  routes.postcreatetest);
app.get('/user/:id/edittest/:testid',  routes.getedittest);
app.put('/user/:id/edittest/:testid',  routes.putedittest);
app.del('/user/:id/testdelete/:testid', routes.deltest);
app.get('/pdffile/:fileid',  routes.pdffile);


// app.get('/user/:id/createtest', ensureAuthenticated, RestirctAccess, routes.getusercreatetest);
// app.post('/user/:id/createtest', ensureAuthenticated, RestirctAccess, routes.postusercreatetest);


app.get('/user/:id/tests',  routes.getusertests);
app.post('/user/:id/tests/upload',  routes.uploadatest);


app.get('/user/:id/questions',  routes.getuserquestions);
app.get('/user/:id/statistics/:testid', routes.getTeststatistics);
app.get('/user/:id/performance',  routes.getselfperformance);






/*
  
    USER UPLOADING

*/

//uploading a file examples
app.get('/uploadtest', routes.getupload);
app.post('/uploadnew',routes.postupload);
app.get('/file/:id', routes.getshowfile2);
app.get('/filePDF/:id', routes.getshowfile3);



app.get('/rabbitmq', routes.rabbitmq);



io.set('log level', 3);
io.sockets.on('connection', function (socket) {

  //this function is called from the browser
  socket.on('RPC_request', function (data){//grading a document in the backend
    console.log('Received request to send an RPC Command');
      rpc.makeRequest('image', data, function respond(err, response){
        if(err)
          console.error('error = ' + err);
        else{
          console.log("response = '" + response.data + "' To browser = '" + response.data.cool);
          socket.emit('RPC_response_Graded', 'the RPC function has returned go check statistics page');
          //console.log("response = '" + response.data + "' is of type = '" + response.contentType+"'");
        }
      });//end of rpc.makerequest
  });//end of RPC_request


  //this function is called for creating a pdf file
  socket.on('RPC_PrintPDF', function(data){
    console.log('recieved request to create pdf');
    rpc.makeRequest('createPDF', data, function respond(err,response){
      if(!err){
        console.log('Returned from java');
        response.createdid = response.data;
        var out = response.createdid.toString();
        console.log('response = ' + out);
        response.textreply = 'Click the download button';
        socket.emit('RPC_Print_response', out);
      }//end of if
      else{
        console.log('Failed RPC');

      }//end of else
    });//end of rpc.makerequest
  });//end of socket.on


  //for statistics page//currently in testing mode //NO LONGER USED
  socket.on("BuildStats_req", function(data){
    console.log("recived request to build chart!");
    // var cool = "1";
    console.log("Client wants to get info on test = " + data.tesid);
    // DB.grabTestResultstest(cool, function(err,result){
    //   if(!err){
    //      // console.log("Results = " + result);
    //     socket.emit("BuildStats_res",result);
    //   }//end of !err if
    //   else{
    //     console.log("No results " );
    //   }//end of !err else
    // });//end of grabTestResults



    // socket.on("getresults", function(data,fn){
    //   console.log('data from client= ' + data);
    //   var cool = "1";
    //   DB.grabTestResultstest(cool, function(err,result){
    //     if(!err){
    //       // console.log("Results = " + result)
    //       fn(result);
    //     }//end of !err if
    //     else{
    //       console.log("No results ");
    //       fn('woot');
    //     }//end of !err else
    //   });//end of grabTestResults
    // });

  });//end of buildstats socket.on






});//end of socket.io








http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
