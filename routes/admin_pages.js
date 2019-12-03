var express = require('express');
const { body } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const app = express();
// ...rest of the initial code omitted for simplicity.
const { check, validationResult } = require('express-validator');

app.get('/', function(req, res) {
	res.render('index', {
		h1 : 'Selamat Datang Admin, Selamat koding di nodejs'
	});
});

app.get('/add_page', function(req, res) {
	var title = "";
	var link = "";
	var content = "";

	res.render('admin/add_page', {
		title : title,
		link : link,
		content : content
	});
});

// app.post('/add_page', [
// 	  body('title')
// 	    .isEmail()
// 	    .normalizeEmail(),
// 	  body('link')
// 	    .not().isEmpty()
// 	    .trim()
// 	    .escape(),
// 	  sanitizeBody('notifyOnReply').toBoolean()
// ], (req, res) => {
//   // Finds the validation errors in this request and wraps them in an object with handy functions
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(422).json({ errors: errors.array() });
//   }

//   console.log('hasil');

//   User.create({
//     title: req.body.username,
//     link: req.body.password
//   }).then(add_page => res.json(add_page));
// });

module.exports = app;