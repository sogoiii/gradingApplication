var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var bcrypt = require('bcrypt');

//var TestS = require('mongoose').model('TestSchema');
//var QuestionSchema = require('mongoose').model('QuestionSchema');
var TestSchema = require('./Test').TestSchema;
var ClassroomSchema = require('./ClassroomSchema').ClassRoomSchema;



//Schema Definition
var TeacherUserSchema = new Schema({
	  email: {type: Email, unique: true },
    username: { type: String},
    //password: {type: String}
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    createdclassroom: {type: Boolean, default: 0},
    // classroom: {
    //   subject: {type: String},
    //   gradeyear: {type: Number},
    //   classname: {type: String },
    //   numofstudents: Number
    // },
    classroom: [ClassroomSchema],
    ActiveTests: [{type: Schema.ObjectId, ref: 'TestSchema'}],
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
  // console.log('going to authenticate user now veri 1');
  // console.log("password = " + password)
  // console.log("hash = " + this.hash);
  bcrypt.compare(password, this.hash, callback);
  // console.log('going to authenticate user now veri 2');
});



//authenticate the teacher user 
TeacherUserSchema.static('authenticateEmail', function(email, password, callback) {
  // console.log('going to authenticate user now 3');
  var messageresult = '';
  // var messageresult = new String();
  // console.log('going to authenticate user now 4');
  this.findOne({ email: email}, function(err, user, messageresult ) {
      if (err) { 
// console.log('going to authenticate user now 5');
        return callback(err); }
      if (!user) { 
        // console.log('going to authenticate user now 6');
        return callback(null, false, 'incorrect user'); 
      }
        // console.log('going to authenticate user now 7');
        user.verifyPassword(password, function(err, passwordCorrect) {
          // console.log('going to authenticate user now 8');
          if (err) { 
            // console.log('going to authenticate user now 9');
            return callback(err); }
          if (!passwordCorrect) { 
            // console.log('going to authenticate user now 10');
          return callback(null, false, 'wrong password')
          } //this gets send to console when the unique error is passed
          // console.log('going to authenticate user now 11');
          return callback(null, user, 'user was found and authenticated');
        });
      //if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      //return callback(null,user);
      });
    });




//export this Schema
 module.exports = mongoose.model('TeacherUserSchema', TeacherUserSchema );
 //module.exports = mongoose.model('ClassRoomSchema', ClassRoomSchema);


