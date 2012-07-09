var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;



var StandardSchema = new Schema ({
	Title: {type: String, required: true},
	Description: {type: String, required: true},
	Grade: {type: Number, required: true},
	Subject: {type: String, default: "Mathematics"},
	Abbreviation: {type: String, uppercase: true, required: true},
	Topic: {type: String, required: true},
	number: {type: Number, required: true},
	Association: {type: String, default: 'Common Core State Standards'}
})// end of standardMet












module.exports = mongoose.model('StandardSchema', StandardSchema );