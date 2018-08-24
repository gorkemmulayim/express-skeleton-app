const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const flash = require('connect-flash');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require('./config/config');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

const sequelize = new Sequelize(config[process.env.NODE_ENV]);
const sequelizeStore = new SequelizeStore({
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
  genid: function () {
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

const sessionChecker = (req, res, next) => {
  if (req.session.user != null) {
    if (req.originalUrl === '/signin' || req.originalUrl === '/user/signin') {
      return res.redirect('/');
    }
    return next();
  }
  if (req.originalUrl === '/signin' || req.originalUrl === '/user/signin') {
    return next();
  }
  return res.redirect('/signin');
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views'));
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(multer().array());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist')));

app.use('/', sessionChecker, indexRouter);
app.use('/user', sessionChecker, userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
