var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('index', {
		h1 : 'Selamat Datang Tedi Lesmana, Selamat koding di nodejs'
	});
});

router.get('/produk', function(req, res) {
	res.render('index', {
		h1 : 'Ini halaman produk'
	});
});

module.exports = router;