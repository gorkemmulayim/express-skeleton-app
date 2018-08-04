var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var session = require('express-session')
var Sequelize = require('sequelize')
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var config = require('./config/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);
var sequelizeStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 60 * 1000,
  expiration: 60 * 60 * 1000
});
sequelizeStore.sync();

app.use(session({
  cookie: {
    secure: true
  },
  genid: function(req) {
    return genuuid()
  },
  proxy: true,
  resave: false,
  saveUninitialized: false,
  secret: require('crypto').randomBytes(64).toString('hex'),
  store: sequelizeStore,
  unset: 'destroy'
}))

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
