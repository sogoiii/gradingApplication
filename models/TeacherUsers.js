
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



//Schema Definition
var TeacherUserSchema = new Schema({
    user: { type: String},
    password: {type: String}
  });





TeacherUserSchema.static('authenticate', function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
      if (err) { return callback(err); }
      if (!user) { return callback(null, false); }
      if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      return done(null,user);
      });
    });
});



//export this Schema
 module.exports = mongoose.model('TeacherUserSchema', TeacherUserSchema );








 //var TeacherUserModel = mongoose.model('TeacherUserSchema');

//module.exports = mongoose.model('TeacherUserSchema', TeacherUserSchema);


/*function TeacherUser(Schema, mongoose){

  TeacherUserSchema = new Schema({
    user: { type: String, required: true},
    password: {type: String, required: true}
  });

  mongoose.model('TeacherUserSchema', TeacherUserSchema );

}

module.exports.TeacherUser = TeacherUser;
*/
