var mongoose = require('mongoose');

var OrderSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	nama_penerima:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	phone:{
		type: Number,
		required: true
	},
	alamat:{
		type: String,
		required: true
	},
	tanggal:{
		type: Date,
		required: true
	},
	total:{
		type: Number,
		required: true
	}
});

var Orders = module.exports = mongoose.model('orders', OrderSchema);