var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var gridfs = require("../gridfs");


//var QuestionSchema = require('mongoose').model('QuestionSchema');
var QuestionSchema = require('./Questions').QuestionSchema;


var TestSchema = new Schema({
	TestName: {type: String, required: true},
	Questions: [QuestionSchema],
	Answers: [mongoose.Schema.Mixed],
	
	NumberOfStudents: {type: Number},
	Gradeyear: {type: Number}, //this could be a string becaue countries have primary and secondary without levels in between
	Subject: {type: String},
	ClassName: {type: String},
	Teacheremail: {type: Email},
	TestCreated: {type: Date, default: Date.now},
	PDFTest: [mongoose.Schema.Mixed],
	CreatedPDF: [mongoose.Schema.Mixed],
	TestResults: [mongoose.Schema.Mixed]
});







 module.exports = mongoose.model('TestSchema', TestSchema);