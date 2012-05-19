var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var WrongAnswerSchema = require('./WrongAnswers').WrongAnswerSchema;



var StandardMetSchema = new Schema ({
	StandardMet: {type: String},
	Percentage: {type: Number}
})// end of standardMet



//NOTE: I may have to have the html and text areas for every question Correct and Wrong answer 

//this schema will have its own unique _id for every instance that is created
var QuestionSchema = new Schema({
	//id: {type: ObjectId},
	Questionhtml: {type: String, required: true, match: /[a-zA-Z0-9;& ]/ },
	//Questiontext: {type: String, match: /^[a-zA-Z0-9 -]$/ },
	CorrectAnswertext: {type: String, required: true, max: 140, match:/^[a-zA-Z0-9 -"]/ },
	WrongAnswers: [WrongAnswerSchema],
	//StandardMet: [StandardMetSchema],
	QuestionCreated: {type: Date, default: Date.now}
	//NumberOfTimesQuestionUsed: {type: Number}, //this number will be updated every time it is used/ must be atomic - performance hit here
});//end of QuestionSchema



 module.exports = mongoose.model('QuestionSchema', QuestionSchema );

 //module.exports = mongoose.model('WrongAnswerSchema', WrongAnswerSchema);
 //module.exports = mongoose.model('StandardMetSchema', StandardMetSchema);