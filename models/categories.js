var mongoose = require('mongoose');

var CategoriSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	link:{
		type: String,
	}
});

var Categories = module.exports = mongoose.model('categories', CategoriSchema);