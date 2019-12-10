var express = require("express");
const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");
var flash = require("connect-flash");
const app = express();
var router = express.Router();
var Page = require("../models/pages");
// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require("express-validator");

router.get("/", function(req, res) {
	res.render("admin/dashboard", {});
});

router.get("/pages", function(req, res) {
	Page.find({})
		.sort({ sorting: 1 })
		.exec(function(err, pages) {
			res.render("admin/pages", {
				pages: pages
			});
		});
});

router.get("/add_page", function(req, res) {
	var title = "";
	var link = "";
	var content = "";

	res.render("admin/add_page", {
		title: title,
		link: link,
		content: content
	});
});

router.post(
	"/add_page",
	[
		body("title", "Mohon isi data title dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("content", "Mohon isi data content dengan benar")
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
		const content = req.body.content;
		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);

		console.log(errors.array());
		// !errors.isEmpty()
		if (errors.array().length > 0) {
			// return res.status(422).json({ errors: errors.array() });
			res.render("admin/add_page", {
				title: req.body.title,
				content: req.body.content,
				link: req.body.link,
				errors: errors.array()
			});
		} else {
			Page.findOne({ link: link }, function(err, page) {
				if (page) {
					req.flash(
						"danger",
						"Page ini telah ada, silahkan gunakan nama page lain"
					);
					res.render("admin/add_page", {
						messages: req.flash("danger"),
						title: title,
						link: link,
						content: content
					});
				} else {
					var page = new Page({
						title: title,
						link: link,
						content: content,
						sorting: 0
					});

					page.save(function(err) {
						if (err) {
							return console.log(err);
						}
						Page.find({})
							.sort({ sorting: 1 })
							.exec(function(err, pages) {
								if (err) {
									console.log(err);
								} else {
									req.app.locals.pages = pages;
								}
							});

						req.flash(
							"success",
							"Page telah berhasil di tambahkan"
						);
						var title = "";
						var link = "";
						var content = "";

						res.render("admin/add_page", {
							title: title,
							link: link,
							content: content
						});
					});
				}
			});
		}
	}
 );

router.post("/reorder-pages", function(req, res) {
	var ids = req.body["id[]"];

	var count = 0;

	for (var i = 0; i < ids.length; i++) {
		var id = ids[i];
		count++;

		(function(count) {
			Page.findById(id, function(err, page) {
				page.sorting = count;
				page.save(function(err) {
					if (err) {
						return console.log(err);
					}
				});
			});
		})(count);
	}
});

router.get("/edit-page/:id", function(req, res) {
	Page.findById(req.params.id, function(err, page) {
		if (err) {
			return console.log(err);
		}
		res.render("admin/edit_pages", {
			title: page.title,
			link: page.link,
			content: page.content,
			id : page._id
		});
	});
});

router.get('/delete-page/:id', function(req, res){
	Page.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			return console.log(err);
		}

		Page.find({}).sort({sorting:1}).exec(function(err, pages){
			if (err) {
				return console.log(err);
			}else{
				req.app.locals.pages = pages;
			}
		});

		req.flash('success', 'Page berhasil di hapus');
		res.redirect('/admin/page');

	});
});

router.post(
	"/update_page",
	[
		body("title", "Mohon isi data title dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("content", "Mohon isi data content dengan benar")
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
		const id = req.body.id;
		const link = req.body.link;
		const content = req.body.content;
		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);

		console.log(errors.array());
		// !errors.isEmpty()
		if (errors.array().length > 0) {
			// return res.status(422).json({ errors: errors.array() });
			res.render("admin/add_page", {
				title: req.body.title,
				content: req.body.content,
				link: req.body.link,
				errors: errors.array()
			});
		} else {
			Page.update({_id:id}, {title:title, link:link, content:content}, function(err){
				if (err) {
					console.log(err);
				}else{
					res.redirect('/');
				}

			});
		}
	}
 );
module.exports = router;
