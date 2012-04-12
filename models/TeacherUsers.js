
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



//Schema Definition
var TeacherUserSchema = new Schema({
    user: { type: String},
    password: {type: String}
  });





//authenticate the teacher user 
TeacherUserSchema.static('authenticate', function(username, password,  callback) {
  this.findOne({ user: username}, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      return callback(null,user);
      });
    });



//export this Schema
 module.exports = mongoose.model('TeacherUserSchema', TeacherUserSchema );


