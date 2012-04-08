(function(){
	var Admin, mongoose, populateAdmins;
	mongoose = require('mongoose');
	Admin = require('../models/adminModel').Admin;
	populateAdmins = function(){
		var shamoonAdmin, shamoonData;
		shamoonData = {
			firstName: "Shamoon",
			lastName: "siddiqui",
			email: "anemail@theemail.com"
		};
		shamoonAdmin = new Admin(shamoonData);
		return shamoonAdmin.save(function(err,item){
			if(err){
				return console.log(err);
			} else {
				return console.log(item);
			}
		});
	};
}).call(this);