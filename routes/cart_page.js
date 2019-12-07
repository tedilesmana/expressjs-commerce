var express = require("express");
var router = express.Router();
var Page = require("../models/pages");
var Product = require("../models/products");

router.get("/", function(req, res) {
	req.session.save(function(err) {
		if (req.session.views) {
			req.session.views++;
			res.setHeader("Content-Type", "text/html");
			res.write("<p>views: " + req.session.views + "</p>");
			res.write(
				"<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>"
			);
			res.end();
		} else {
			req.session.views = 1;
			req.session.save(function(err) {
				if (err) {
					console.log(err);
				} else {
					req.session.views = 1;
				}
				// session saved
			});
			console.log(req.session);
			res.end("welcome to the session demo. refresh!");
		}
	});
	console.log(req.session);
});

// router.get("/add/:id", function(req, res) {
// 	if (req.session.page_views) {
// 		req.session.page_views++;
// 		console.log(req.session.page_views);
// 	} else {
// 		req.session.page_views = 1;
// 		console.log(req.session.page_views);
// 	}

// 	process.exit();

// 	var id = req.params.id;
// 	var cart = [].req.session.cart;
// 	console.log(cart);

// 	Product.findOne({ _id: id }, function(err, product) {
// 		if (err) {
// 			console.log(err);
// 		}

// 		if (typeof req.session.cart == "undefined") {
// 			cart = [];
// 			cart.push({
// 				newId: product._id,
// 				title: product.title,
// 				qty: 1,
// 				price: product.price,
// 				image: product.images,
// 				desc: product.desc
// 			});

// 			// console.log(cart);
// 		} else {
// 			var newItem = true;

// 			// console.log(cart);process.exit();

// 			for (var i = 0; i < cart.length; i++) {
// 				if (cart[i].newId == id) {
// 					cart[i].qty++;
// 					newItem = false;
// 					break;
// 				}
// 			}

// 			if (newItem) {
// 				cart.push({
// 					newId: product._id,
// 					title: product.title,
// 					qty: 1,
// 					price: product.price,
// 					image: product.images,
// 					desc: product.desc
// 				});
// 			}
// 		}
// 	});

// 	req.flash("success", "Product berhasil di tambahkan");
// 	res.redirect("back");
// });

module.exports = router;

// var mongoose = require('mongoose');
// var crypto = require('crypto');

// var secret = 'codepolitan';
// var password = crypto.createHmac('sha256', secret)
//                    .update('rahasia123')
//                    .digest('hex');

// console.log("Password: " + password);

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/organo');

// var User = require('../models/user');

// User.find({username:'superadmin'}, function (err, user){
//     if (user.length == 0)
//     {
//         var admin = new User({
//             username: 'superadmin',
//             email: 'admin@example.com',
//             password: password,
//             firstname: 'super',
//             lastname: 'admin',
//             admin: true,
//         });

//         admin.save(function(err) {
//           if (err) throw err;

//           console.log('Admin is created!');
//         });
//     }
// });

// User.find({username:'supermember'}, function (err, user){
//     if (user.length == 0)
//     {
//         var member = new User({
//             username: 'supermember',
//             email: 'member@example.com',
//             password: password,
//             firstname: 'super',
//             lastname: 'member',
//             admin: false,
//         });

//         member.save(function(err) {
//           if (err) throw err;

//           console.log('Member is created!');
//         });
//     }
// });

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var userSchema = new Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   email: { type: String, required: true },
//   firstname: String,
//   lastname: String,
//   admin: Boolean,
// },
// {
//     timestamps: true
// });

// var User = mongoose.model('User', userSchema);

// module.exports = User;

// var Auth = {
//     check_login: function (req, res, next)
//     {
//         if (!req.session.logged_in) {
//             return res.redirect('/login');
//         }

//         next();
//     },
//     is_admin: function (req, res, next)
//     {
//         if (!req.session.admin) {

//             req.flash('info', 'Maaf, Anda tidak dapat mengakses halaman yang Anda tuju!');
//             return res.redirect('/');
//         }

//         next();
//     },
// };

// module.exports = Auth;
