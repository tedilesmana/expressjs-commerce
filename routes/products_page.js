var express = require("express");
var router = express.Router();
var Page = require("../models/pages");
var Product = require("../models/products");

router.get("/", function(req, res) {
	Product.find({})
		.sort({ sorting: 1 })
		.exec(function(err, products) {
			res.render("public/products", {
				products: products
			});
		});
});

router.get("/detail/:id", function(req, res) {
	var id = req.params.id;

	Product.findOne({_id:id}, function(err, products) {
			res.render("public/detail", {
				products: products
			});
		});
});

module.exports = router;
