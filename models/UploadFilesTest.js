var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
var gridfs = require("../gridfs");


ApplicationSchema = new mongoose.Schema({
    name: String,
    files: [mongoose.Schema.Mixed]
  });

  ApplicationSchema.methods.addFile = function(file, options, fn) {
    var application;
    application = this;
    return gridfs.putFile(file.path, file.filename, options, function(err, result) {
      application.files.push(result);
      return application.save(fn);
    });
  };


  //export this Schema
 module.exports = mongoose.model("application", ApplicationSchema);