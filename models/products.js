var mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	link:{
		type: String,
	},
	desc:{
		type: String,
		required: true
	},
	categories:{
		type: String,
		required: true
	},
	price:{
		type: Number,
		required: true
	},
	images:{
		type: String
	}
});

var Products = module.exports = mongoose.model('products', ProductSchema);