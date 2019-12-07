var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var config = require("./config/database");
var bodyParser = require("body-parser");
var session = require("express-session");
const { check, validationResult } = require("express-validator");
const validation = require("express-validator");
var fileUpload = require("express-fileupload");
var mv = require("mv");
var Page = require("./models/pages");
var Categori = require("./models/categories");

mongoose.connect(config.database);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
	console.log("Conected to Mongodb");
});

var app = express();

app.locals.errors = null;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// express session
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false, maxAge: 60000 }
	})
);

// app.use(validation({
// 	customValidator: {
// 		isImage: function(value, filename){
// 			var extension = (path.extname(filename)).toLowerCase();
// 			switch (extension){
// 				case '.jpg':
// 					return '.jpg';
// 				case '.jpeg':
// 					return '.jpeg';
// 				case '.png':
// 					return '.png';
// 				case '':
// 					return '.jpg';
// 				default:
// 					return false;
// 			}
// 		}
// 	}
// }));

//express message
app.use(require("connect-flash")());
app.use(function(req, res, next) {
	res.locals.messages = require("express-messages")(req, res);
	next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// app.get('/', function(req, res) {
// 	res.render('index');
// });

//file Upload
app.use(fileUpload());
// app.use(mv());

// app.get("*", function(req, res, next) {
// 	res.locals.cart = req.session.cart;
	// var cart = req.session.cart;

	// if (typeof cart == "undefined") {
	// 	qty = 0;
	// } else {
	// 	var qty = 0;
	// 	for (var i = 0; i < cart.length; i++) {
	// 		qty = qty + cart[i].qty;
	// 	}
	// }

	// res.locals.countQty = qty;
// 	next();
// });

var page = require("./models/pages.js");

var public_pages = require("./routes/public_pages.js");

var products_page = require("./routes/products_page.js");

var categori_page = require("./routes/categori_page.js");

var cart_page = require("./routes/cart_page.js");

var admin_pages = require("./routes/admin_pages.js");

var admin_categories = require("./routes/admin_categories.js");

var admin_products = require("./routes/admin_products.js");

app.use("/", public_pages);

app.use("/products/page", products_page);

app.use("/categori/page", categori_page);

app.use("/cart/page", cart_page);

app.use("/admin/page", admin_pages);

app.use("/admin/products", admin_products);

app.use("/admin/categories", admin_categories);

//Get al pages to header ejs
Page.find({})
	.sort({ sorting: 1 })
	.exec(function(err, pages) {
		if (err) {
			console.log(err);
		} else {
			app.locals.pages = pages;
		}
	});

//Get al kategori to header ejs
Categori.find({})
	.sort({ _id: 1 })
	.exec(function(err, categories) {
		if (err) {
			console.log(err);
		} else {
			app.locals.categories = categories;
		}
	});

var port = 3000;

app.listen(port, function() {
	console.log("Server brjalan dengan port" + port);
});
