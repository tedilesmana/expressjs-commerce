var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	username:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	phone:{
		type: Number,
	},
	admin:{
		type: Number,
	}
});

var Users = module.exports = mongoose.model('users', UserSchema);