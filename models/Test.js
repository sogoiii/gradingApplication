var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var gridfs = require("../gridfs");


//var QuestionSchema = require('mongoose').model('QuestionSchema');
var QuestionSchema = require('./Questions').QuestionSchema;

var AnswersSchema = new Schema({
	Answer : {type: String},
	IDS : {type: String},
	correct: {type: Number, min: 0, max:1},
	found: {type: Number, min: 0, max: 3},
	selected:{type: Number, min:0, max: 3}
});

var TestGradedSchema = new Schema({
	WasGraded : {type: Number, default: 0},
	GradedOn: {type: Date}
});

 

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
	TestResults: [mongoose.Schema.Mixed],
	TRbyQuestions: [mongoose.Schema.Mixed],
	TRbyStudents: [mongoose.Schema.Mixed],
	TRbyTest:{
		Mean: {type: Number},
		PercentCorrect: {type: Number},
		PercentIncorrect: {type: Number},
		STD: {type: Number},
		_id: Schema.ObjectId
	},
	TestGraded: {
		WasGraded : {type: Number, default: 0},
		GradedOn: {type: Date}
	}
});







 module.exports = mongoose.model('TestSchema', TestSchema);