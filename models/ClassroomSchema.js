var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');



var ClassRoomSchema = new Schema ({
  subject: {type: String, match: /^[a-zA-Z0-9 -]+$/},
  gradeyear: {type: Number},
  classname: {type: String, match: /^[a-zA-Z0-9 -]+$/ },
  numofstudents: {type: Number},
  classcreated: {type: Date, default: Date.now}
})// end of standardMet







 module.exports = mongoose.model('ClassroomSchema', ClassRoomSchema);