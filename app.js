var createError = require('http-errors');
var express = require('express');
var hbs = require('hbs');
var flash = require('connect-flash');
var crypto = require('crypto');
var multer = require('multer');
var path = require('path');
var logger = require('morgan');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var config = require('./config/config');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

var sequelize = new Sequelize(config[process.env.NODE_ENV]);
var sequelizeStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 10 * 60 * 1000,
  expiration: 60 * 60 * 1000
});
sequelizeStore.sync();

app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  cookie: {
    expires: 60 * 60 * 1000
  },
  genid: function() {
    return crypto.randomBytes(64).toString('hex');
  },
  proxy: true,
  resave: false,
  saveUninitialized: false,
  secret: require('crypto').randomBytes(64).toString('hex'),
  store: sequelizeStore,
  unset: 'destroy'
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/', sessionChecker, (req, res, next) => {
  res.redirect('/signin');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views'));
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multer().array());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist')));

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
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
