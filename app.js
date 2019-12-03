var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session')

mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Conected to Mongodb');
});

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//express message
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res) {
// 	res.render('index');
// });

var page = require('./models/pages.js')

var public_pages = require('./routes/public_pages.js');

var admin_pages = require('./routes/admin_pages.js');

app.use('/',public_pages);

app.use('/admin',admin_pages);

var port = 3000;

app.listen(port, function() {
	console.log('Server brjalan dengan port' + port);
});
