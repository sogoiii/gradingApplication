var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;



var StandardsSchema= new Schema ({
	Subject: {type: String, default: 'Mathematics'},
	Headline: {type: String, required: true},
	Section: {type: String, required: true},
	SubSection: {type: String, required: true},
	Description: {type: String, required: true},
	Dnumber: {type: Number, required: true},
	GradeLevel: {type: String, required: true},
	Abbreviation: {type: String, uppercase: true, required: true},
	Association: {type: String, default: 'Common Core State Standards'}
})// end of standardMet












module.exports = mongoose.model('StandardsSchema', StandardsSchema );