var mongoose = require('mongoose');

var OrderDetailSchema = mongoose.Schema({
	id_order:{
		type: String,
		required: true
	},
	product_title:{
		type: String,
		required: true
	},	
	product_qty:{
		type: Number,
		required: true
	},
	subtotal:{
		type: Number,
		required: true
	}
});

var OrderDetails = module.exports = mongoose.model('orderdetails', OrderDetailSchema);