var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;



var StandardSchema = new Schema ({
	Title: {type: String, required: true},
	Description: {type: String, required: true},
	Headline: {type: String, required: true, default: 'Grade 11-12'},
	Grade: {type: Number},
	GradeClassifier: {type: String},
	Section: {type: String},
	Subject: {type: String},
	Abbreviation: {type: String, uppercase: true, required: true, default: 'WHST'},
	Topic: {type: String, required: true, default : 'Writing Standards for Literacy in History/Social Studies, Science, and Technical Subjects'},
	number: {type: Number, required: true},
	Association: {type: String, default: 'Common Core State Standards'}
})// end of standardMet








module.exports = mongoose.model('StandardSchema', StandardSchema );
