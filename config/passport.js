var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var bcrypt = require('bcryptjs');
var passport = require('passport');

module.exports = function(passport) {
	passport.use(new LocalStrategy(function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) {
					console.log(err);
				}

				if (!user) {
					return done(null, false, {
						message: "User tidak di temukan"
					});
				}

				bcrypt.compare(password, user.password, function(err, isMatch) {
					if (err) {
						console.log(err);
					}

					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, { message: "Password Salah" });
					}
				});
			});
		})
	);
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
