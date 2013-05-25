var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var KeywordSchema = new Schema ({
	Keyword: {type: String},
})// end of standardMet


var StandardSchema = new Schema ({
	Title: {type: String},
	Description: {type: String},
	Grade: {type: Number},
	Subject: {type: String},
	Abbreviation: {type: String, uppercase: true},
	Topic: {type: String},
	number: {type: Number}
})// end of standardMet


var TagSchema = new Schema({

	keywords: [KeywordSchema],
	standards: [StandardSchema]



});//end of TagSchema












module.exports = mongoose.model('TagSchema', TagSchema );