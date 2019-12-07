var LocalStrategy = require("passport-local").Strategy;
var User = require("../model/users");
var bcrypt = require("bcryptjs");

module.exports = function(passport) {
	passport.use(
		new LocalStrategy(function(username, pass, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) {
					console.log(err);
				}

				if (!user) {
					return done(null, false, {
						message: "User tidak di temukan"
					});
				}

				bcrypt.compare(pass, user.password, function(err, isMatch) {
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
};
