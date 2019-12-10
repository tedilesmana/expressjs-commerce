var express = require("express");
const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");
// const { check, validationResult } = require('express-validator');
var flash = require("connect-flash");
const app = express();
var mkdirp = require("mkdirp");
var fs = require("fs-extra");
var resizeImg = require("resize-img");
var router = express.Router();
var Product = require("../models/products");
var Categories = require("../models/categories");
var fileUpload = require("express-fileupload");
var mv = require("mv");
// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require("express-validator");

router.get("/", function(req, res) {
	var count;

	Product.count(function(err, c) {
		count = c;
	});

	Product.find(function(err, products) {
		res.render("admin/products", {
			products: products,
			count: count
		});
	});
});

router.get("/add_product", function(req, res) {
	var title = "";
	var desc = "";
	var price = "";

	Categories.find(function(err, categories) {
		res.render("admin/add_product", {
			title: title,
			desc: desc,
			categories: categories,
			price: price
		});
	});
});

router.post(
	"/add_product",
	[
		body("title", "Mohon isi data title dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("desc", "Mohon isi data desc dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("price", "Mohon isi data price dengan benar")
			.not()
			.isEmpty()
			.trim()
			.escape(),
		sanitizeBody("notifyOnReply").toBoolean()
	],
	(req, res) => {
		const errors = validationResult(req);
		// console.log(req.files.image.name);
		// var imageFile =	typeof req.files.image !== "undefined" ? req.files.image.name : "";
		// if (req.body.image) {
		// 	var imageFile = "";
		// } else {
		// 	var imageFile = req.files.image.name;
		// }

		// check("title", "Title harus di isi").notEmpty();
		// check("desc", "Title harus di isi").notEmpty();
		// check("price", "Title harus di isi").notEmpty();
		// check("image", "Title harus di isi").isImage(imageFile);

		var title = req.body.title;
		var link = req.body.categories;
		var desc = req.body.desc;
		var price = req.body.price;
		var categories = req.body.categories;
		var imageFile = req.files.image.name;

		// var errors = req.validationErrors();

		if (errors.array().length > 0) {
			Categories.find(function(err, categoriess) {
				res.render("admin/add_product", {
					errors: errors,
					title: title,
					desc: desc,
					categories: categoriess,
					price: price
				});
			});
		} else {
			Product.findOne({ title: title }, function(err, product) {
				if (product) {
					req.flash("danger", "Page ini telah ada");
					Categories.find(function(err, categoriess) {
						res.render("admin/add_product", {
							title: title,
							desc: desc,
							categories: categoriess,
							price: price
						});
					});
				} else {
					var product = new Product({
						title: title,
						link: link,
						desc: desc,
						categories: categories,
						price: price,
						images: imageFile
					});

					product.save(function(err) {
						if (err) {
							return console.log(err);
						}

						// mkdirp("public/product_images/" + product._id, function(
						// 	err
						// ) {
						// 	return console.log(err);
						// });

						if (imageFile != "") {
							var productImage = req.files.image;
							var path =
								"public/product_images/" + "/" + imageFile;
							console.log(productImage);

							productImage.mv(path, function(err) {
								return console.log(err);
							});
						}

						req.flash("success", "Product Berhasil di tambahkan");
						res.redirect("/admin/products/add_product");
					});
				}
			});
		}
	}
);

router.get("/delete-product/:id", function(req, res) {
	var id = req.params.id;
	var image = req.query.action;
	var path = "public/product_images/" + image;

	fs.remove(path, function(err) {
		if (err) {
			return console.log('err');
		} else {
			Product.findByIdAndRemove(id, function(err) {
				if (err) {
					return console.log(err);
				}
			});
			req.flash("success", "Product berhasil di hapus");
			res.redirect("/admin/products");
		}
	});
});

module.exports = router;
