var mongoose = require('mongoose')
var Schema = mongoose.Schema;

//var QuestionSchema = require('mongoose').model('QuestionSchema');
var QuestionSchema = require('./Questions');


var TestSchema = new Schema({
	TestName: {type: String, required: true},
	Questions: [QuestionSchema],
	NumberOfStudents: {type: Number},
	Gradeyear: {type: Number}, //this could be a string becaue countries have primary and secondary without levels in between
	Subject: {type: String},
	Class: {type: String},

	TestCreated: {type: Date, default: Date.now}


});



 module.exports = mongoose.model('TestSchema', TestSchema);