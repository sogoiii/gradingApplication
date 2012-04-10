
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TeacherUserSchema = new Schema({
    user: { type: String, required: true},
    password: {type: String, required: true}
  });

 mongoose.model('TeacherUserSchema', TeacherUserSchema );
 var TeacherUserModel = mongoose.model('TeacherUserSchema');

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
