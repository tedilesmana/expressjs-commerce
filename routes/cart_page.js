var express = require("express");
var router = express.Router();
var Page = require("../models/pages");
var Product = require("../models/products");

router.get("/add/:id", function(req, res) {
	var id = req.params.id;

	if (!req.session.count) {
		req.session.count = 0;
	}
	req.session.count += 1;

	Product.findOne({ _id: id }, function(err, product) {
		if (err) {
			console.log(err);
		}

		if (typeof req.session.cart == "undefined") {
			req.session.cart = [];
			req.session.cart.push({
				newId: product._id,
				title: product.title,
				qty: 1,
				price: product.price,
				image: product.images,
				desc: product.desc
			});
			req.session.save();
		} else {
			var cart = req.session.cart;
			var newItem = true;

			for (var i = 0; i < cart.length; i++) {
				if (cart[i].newId == id) {
					cart[i].qty++;
					newItem = false;
					req.session.save();
					break;
				}
			}

			if (newItem) {
				cart.push({
					newId: product._id,
					title: product.title,
					qty: 1,
					price: product.price,
					image: product.images,
					desc: product.desc
				});
				req.session.save();
			}
		}
	});

	req.flash("success", "Product berhasil di tambahkan");
	res.redirect("back");
});

router.get('/shoping-cart', function(req, res){
	res.render('public/shoping-cart', {
		carts: req.session.cart
	})
})

module.exports = router;
