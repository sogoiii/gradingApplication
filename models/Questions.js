var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var WrongAnswer = new Schema ({
	WrongAnswertext: {type: String, required: true, match:/^[a-zA-Z0-9 -]$/i },
	NumberOfTimesSelected: {type: Number},
	NumberOfTimesUsed: {type: Number}
});//end of wrong answer

var StandardMet = new Schema ({
	StandardMet: {type: String},
	Percentage: {type: Number}
})// end of standardMet



//NOTE: I may have to have the html and text areas for every question Correct and Wrong answer 

//this schema will have its own unique _id for every instance that is created
var QuestionSchema = new Schema({
	Questionhtml: {type: String, required: true, match: /^[a-zA-Z0-9 -<>]$/i },
	Questiontext: {type: String, match: /^[a-zA-Z0-9 -]$/ },
	CorrectAnswertext: {type: String, required: true, match:/^[a-zA-Z0-9 -]$/i },
	WrongAnswers: [WrongAnswer],
	StandardMet: [StandardMet],

	NumberOfTimesQuestionUsed: {type: Number}, //this number will be updated every time it is used/ must be atomic - performance hit here
});//end of QuestionSchema



 module.exports = mongoose.model('QuestionSchema', QuestionSchema );