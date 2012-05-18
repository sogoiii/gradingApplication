var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");



var ClassRoomSchema = new Schema ({
  subject: {type: String},
  gradeyear: {type: Number},
  classname: {type: String },
  numofstudents: {type: Number},
  classcreated: {type: Date, default: Date.now}
})// end of standardMet







 module.exports = mongoose.model('ClassroomSchema', ClassRoomSchema);