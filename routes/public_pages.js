var express = require("express");
var router = express.Router();
var Page = require("../models/pages");
var Product = require("../models/products");

router.get("/:link", function(req, res) {
	var link = req.params.link;

	res.render("public/" + link, {
		title: link
	});
});

router.get("/", function(req, res) {
	Product.find({})
		.sort({ sorting: 1 })
		.exec(function(err, products) {
			res.render("public/home", {
				products: products,
			});
		});
});

router.get("/login", function(req, res) {
	res.render("public/login", {});
});

router.get("/register", function(req, res) {
	res.render("public/register", {});
});

router.get("/cart", function(req, res) {
	res.render("public/cart", {});
});

router.get("/checkout", function(req, res) {
	res.render("public/checkout", {});
});

// router.get('/produk', function(req, res) {
// 	res.render('index', {
// 		h1 : 'Ini halaman produk'
// 	});
// });

module.exports = router;
