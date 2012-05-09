var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var WrongAnswerSchema = new Schema ({
	WrongAnswertext: {type: String, required: true, match:/^[a-zA-Z0-9 -"]/ },
	NumberOfTimesSelected: {type: Number},
	NumberOfTimesUsed: {type: Number}
});//end of wrong answer

module.exports = mongoose.model('WrongAnswerSchema', WrongAnswerSchema );