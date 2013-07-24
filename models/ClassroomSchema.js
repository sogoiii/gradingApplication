var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');



var ClassRoomSchema = new Schema ({
  Subject: {type: String, match: /^[a-zA-Z0-9 -]+$/},
  Gradeyear: {type: Number},
  ClassName: {type: String, match: /^[a-zA-Z0-9 -]+$/ },
  NumberOfStudents: {type: Number},
  classcreated: {type: Date, default: Date.now}
})// end of standardMet







 module.exports = mongoose.model('ClassroomSchema', ClassRoomSchema);