var express = require("express");
const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const { check, validationResult } = require("express-validator");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");
var User = require("../models/users");

router.get("/login", function(req, res) {
	if (res.locals.user) {
		res.redirect("/");
	}
	res.render("public/login", {});
});

router.get("/register", function(req, res) {
	if (res.locals.user) {
		res.redirect("/");
	}
	res.render("public/register", {});
});

router.post(
	"/register",
	[
		body("name", "Mohon isi data name dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("username", "Mohon isi data content dengan benar")
			// .isEmail()
			// .normalizeEmail(),
			.not()
			.isEmpty()
			.trim()
			.escape(),
		body("pass", "Mohon isi data link dengan benar")
			.not()
			.isEmpty()
			.trim()
			.escape(),
		sanitizeBody("notifyOnReply").toBoolean()
	],
	(req, res) => {
		var name = req.body.name;
		var username = req.body.username;
		var password = req.body.pass;
		var email = req.body.email;
		var cpass = req.body.cpass;
		var phone = req.body.phone;

		const errors = validationResult(req);

		console.log(errors.array());

		if (errors.array().length > 0) {
			console.log("error cuk");
			res.render("public/register", {
				errors: errors,
				user: null
			});
		} else {
			User.findOne({ username: username }, function(err, user) {
				if (err) {
					console.log(err);
				}

				if (user) {
					req.flash(
						"danger",
						"username sudah ada, silahkan memakai yang lainnya"
					);
					res.redirect("/users/page/register");
				} else {
					var user = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						phone: phone,
						admin: 0
					});

					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(user.password, salt, function(err, hash) {
							if (err) {
								console.log(err);
							}

							user.password = hash;

							user.save(function(err) {
								if (err) {
									console.log(err);
								} else {
									req.flash(
										"success",
										"Selamat, data telah berhasil di registrasi"
									);
									res.redirect("/users/page/login");
								}
							});
						});
					});
				}
			});
		}
	}
);

router.post("/login", function(req, res, next){
	console.log(req.user);
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/users/page/login",
		failureFlash: true
	})(req, res, next);
});

module.exports = router;
