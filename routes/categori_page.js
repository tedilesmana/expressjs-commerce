var express = require("express");
var router = express.Router();
var Page = require("../models/pages");
var Product = require("../models/products");
var Categori = require("../models/categories");

router.get("/:cat", function(req, res) {
	var linkCat = req.params.cat;

	Product.find({categories:linkCat})
		.sort({ sorting: 1 })
		.exec(function(err, products) {
			res.render("public/products", {
				products: products
			});
		});
});

module.exports = router;
