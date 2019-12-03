var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('public/home', {
	});
});

router.get('/login', function(req, res) {
	res.render('public/login', {
	});
});

router.get('/register', function(req, res) {
	res.render('public/register', {
	});
});

router.get('/cart', function(req, res) {
	res.render('public/cart', {
	});
});

router.get('/checkout', function(req, res) {
	res.render('public/checkout', {
	});
});

// router.get('/produk', function(req, res) {
// 	res.render('index', {
// 		h1 : 'Ini halaman produk'
// 	});
// });

module.exports = router;