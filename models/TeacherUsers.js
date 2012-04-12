var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var bcrypt = require('bcrypt');


//Schema Definition
var TeacherUserSchema = new Schema({
	email: Email,
    user: { type: String},
    //password: {type: String}
    salt: {type: String, required: true},
    hash: {type: String, required: true}
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
  this.findOne({ email: email}, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
        user.verifyPassword(password, function(err, passwordCorrect) {
          if (err) { return callback(err); }
          if (!passwordCorrect) { return callback(null, false)}
          return callback(null, user);
        });


      //if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      //return callback(null,user);
      });
    });




//export this Schema
 module.exports = mongoose.model('TeacherUserSchema', TeacherUserSchema );


