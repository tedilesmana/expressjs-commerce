var express = require("express");
var router = express.Router();
var Page = require("../models/pages");
var Product = require("../models/products");
var Order = require("../models/orders");
var OrderDetail = require("../models/orderdetails");
const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const { check, validationResult } = require("express-validator");

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

router.get("/shoping-cart", function(req, res) {
	res.render("public/shoping-cart", {
		carts: req.session.cart
	});
});

router.get("/update/:link", function(req, res) {
	var link = req.params.link;
	var cart = req.session.cart;
	var action = req.query.action;

	for (var i = 0; i < cart.length; i++) {
		if (cart[i].title == link) {
			switch (action) {
				case "add":
					cart[i].qty++;
					break;
				case "remove":
					cart[i].qty--;
					if (cart[i].qty < 1) {
						cart.splice(i, 1);
					}
					break;
				case "clear":
					cart.splice(i, 1);
					if (cart.length == 0) {
						delete req.session.cart;
					}
					break;
				default:
					console.log("perubahan data gagal");
					break;
			}
			break;
		}
	}
	req.flash("success", "Produk berhasil di tambahkan");
	res.redirect("/cart/page/shoping-cart");
});

router.get("/clear", function(req, res) {
	delete req.session.cart;

	req.flash("success", "Cart telah di hapus");
	res.redirect("/cart/page/shoping-cart");
});

router.get("/checkout", function(req, res) {
	// if (typeof req.user == 'undefined') {
	// 	res.redirect('/users/page/login');
	// }
	console.log(req.session.cart);
	res.render("public/checkout", {
		carts: req.session.cart
	});
});

router.post(
	"/checkout",
	[
		body("username", "Mohon isi data username dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("penerima", "Mohon isi data penerima dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("email", "Mohon isi data email dengan benar")
			.not()
			.isEmpty()
			.trim()
			.escape(),
		sanitizeBody("notifyOnReply").toBoolean()
	],
	(req, res) => {
		var cart = req.session.cart;

		const errors = validationResult(req);

		console.log(errors.array());
		// !errors.isEmpty()
		if (errors.array().length > 0) {
			res.render("public/checkout", {
				carts: cart
			});
		} else {
			var username = req.body.username;
			var penerima = req.body.penerima;
			var email = req.body.email;
			var phone = req.body.phone;
			var alamat = req.body.alamat;
			var total = req.body.total;
			var newDate = new Date();

			var order = new Order({
				username: username,
				nama_penerima: penerima,
				email: email,
				phone: phone,
				alamat: alamat,
				tanggal: newDate,
				total: total
			});

			order.save(function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log("cart");
					Order.findOne({ username: username }, function(err, orders) {
						cart.forEach(function(product) {
							var subtotal = product.qty * product.price;
							var orderdetail = new OrderDetail({
								id_order: orders.id,
								product_title: product.title,
								product_qty: product.qty,
								subtotal: subtotal
							});

							orderdetail.save(function(err) {
								if (err) {
									console.log(err);
								}
							});
						});
					}).sort({ tanggal: -1 });
					delete req.session.cart;
					req.flash("success", "Pembelian anda berhasil di simpan");
					res.redirect("/");
				}
			});
		}
	}
);

module.exports = router;
