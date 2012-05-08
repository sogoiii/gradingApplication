var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var bcrypt = require('bcrypt');

//var TestS = require('mongoose').model('TestSchema');
//var QuestionSchema = require('mongoose').model('QuestionSchema');
var TestSchema = require('./Test');



//Schema Definition
var TeacherUserSchema = new Schema({
	  email: {type: Email, unique: true },
    username: { type: String},
    //password: {type: String}
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    createdclassroom: {type: Boolean, default: 0},
    classroom: {
      subject: {type: String},
      gradeyear: {type: Number},
      classname: {type: String },
      numofstudents: Number
    },
    Tests: [TestSchema],
    UserCreated: {type: Date, default: Date.now}
  });






TeacherUserSchema
.virtual('password')
.get(function () {
  return this._password;
})
.set(function (password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});




/*
//authenticate the teacher user 
TeacherUserSchema.static('authenticate', function(username, password,  callback) {
  this.findOne({ user: username}, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      return callback(null,user);
      });
    });
*/


TeacherUserSchema.method('verifyPassword', function(password, callback) {
  bcrypt.compare(password, this.hash, callback);
});



//authenticate the teacher user 
TeacherUserSchema.static('authenticateEmail', function(email, password, callback) {
  var messageresult = new String();
  this.findOne({ email: email}, function(err, user, messageresult ) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false, 'incorrect user'); }
        user.verifyPassword(password, function(err, passwordCorrect) {
          if (err) { return callback(err); }
          if (!passwordCorrect) { return callback(null, false, 'wrong password')} //this gets send to console when the unique error is passed
          return callback(null, user);
        });


      //if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      //return callback(null,user);
      });
    });




//export this Schema
 module.exports = mongoose.model('TeacherUserSchema', TeacherUserSchema );


