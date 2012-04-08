(function() {
  var AdminSchema, mongoose;
  mongoose = require('../node_module/mongoose');
  AdminSchema = new mongoose.Schema({
  	firstName:{
  		type: String
  	},
  	lastName:{
  		type: String
  	},
  	email:{
  		type: String,
  		lowercase:  true
  	},
  	addedOn:{
  		type: Date,
  		"default": Date.now
  	}
  });
  exports.Admin = mongoose('Admin', AdminSchema, 'admin');
}).call(this);
