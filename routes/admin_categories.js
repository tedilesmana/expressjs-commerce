var express = require("express");
const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");
var flash = require("connect-flash");
const app = express();
var router = express.Router();
var Categori = require("../models/categories");
// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require("express-validator");

router.get("/", function(req, res) {
	Categori.find({})
		.sort({ sorting: 1 })
		.exec(function(err, categories) {
			res.render("admin/categories", {
				categories: categories
			});
		});
});

router.get("/add_categories", function(req, res) {
	var title =  "";
	var link =  "";
	res.render('admin/add_categories',{
		title : title,
		link : link
	});
});

router.post(
	"/add_categories",
	[
		body("title", "Mohon isi data title dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("link", "Mohon isi data link dengan benar")
			.not()
			.isEmpty()
			.trim()
			.escape(),
		sanitizeBody("notifyOnReply").toBoolean()
	],
	(req, res) => {
		const title = req.body.title;
		const link = req.body.link;
		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);

		console.log(errors.array());
		// !errors.isEmpty()
		if (errors.array().length > 0) {
			// return res.status(422).json({ errors: errors.array() });
			res.render("admin/add_categories", {
				title: req.body.title,
				link: req.body.link,
				errors: errors.array()
			});
		} else {
			Categori.findOne({ link: link }, function(err, page) {
				if (page) {
					req.flash(
						"danger",
						"Kategori ini telah ada, silahkan gunakan nama page lain"
					);
					res.render("admin/add_categories", {
						messages: req.flash("danger"),
						title: title,
						link: link
					});
				} else {
					var categori = new Categori({
						title: title,
						link: link
					});

					categori.save(function(err) {
						if (err) {
							return console.log(err);
						}
						Categori.find({})
							.sort({ _id: 1 })
							.exec(function(err, categories) {
								if (err) {
									console.log(err);
								} else {
									req.app.locals.categories = categories;
								}
							});

						req.flash(
							"success",
							"Kategori telah berhasil di tambahkan"
						);
						var title = "";
						var link = "";

						res.render("admin/add_categories", {
							title: title,
							link: link,
						});
					});
				}
			});
		}
	}
);

router.get("/edit-cat/:id", function(req, res) {
	Categori.findById(req.params.id, function(err, categori) {
		if (err) {
			return console.log(err);
		}
		res.render("admin/edit_categori", {
			title: categori.title,
			link: categori.link,
			id : categori._id
		});
	});
});
 
module.exports = router;