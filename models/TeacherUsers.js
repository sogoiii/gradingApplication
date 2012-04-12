var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;


//Schema Definition
var TeacherUserSchema = new Schema({
	email: Email,
    user: { type: String},
    password: {type: String}
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


//authenticate the teacher user 
TeacherUserSchema.static('authenticate', function(email, password,  callback) {
  this.findOne({ email: email}, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      return callback(null,user);
      });
    });




//export this Schema
 module.exports = mongoose.model('TeacherUserSchema', TeacherUserSchema );


