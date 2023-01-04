var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dashboard = require('./routes/dashboard');
var category = require('./routes/category');
var product = require('./routes/product');

var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo');


mongoose.connect(process.env.MONGO_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  // store: new MongoStore({
  //   mongooseConnection: db
  // })
}));
// var mongoose   = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_ADDRESS, {useNewUrlParser: true, useUnifiedTopology: true});
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/',express.static('uploads'), category);
app.use('/',express.static('uploads'), product);
app.use('/', usersRouter);
app.use('/', dashboard);
//app.use('/', express.static('uploads'),commoninsert);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
