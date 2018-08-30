const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const logger = require('morgan');

const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require('./config/config');
const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);
const Umzug = require('umzug');
const migrations = new Umzug({
  storage: "sequelize",

  storageOptions: {
    sequelize: sequelize
  },

  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ],
    path: path.join(__dirname, "./migrations")
  }
});
migrations.up();

const seeders = new Umzug({
  storage: "sequelize",

  storageOptions: {
    sequelize: sequelize
  },

  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize
    ],
    path: path.join(__dirname, "./seeders")
  }
});
seeders.up();

const sequelizeStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 60 * 1000,
  expiration: 60 * 60 * 1000
});
sequelizeStore.sync();

let sess = {
  key: 'sid',
  cookie: {
    expires: 60 * 60 * 1000
  },
  genid: function () {
    return crypto.randomBytes(64).toString('hex');
  },
  proxy: true,
  resave: false,
  saveUninitialized: false,
  secret: 'secret',
  store: sequelizeStore,
  unset: 'destroy'
};

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

app.use(session(sess));

app.use(function (req, res, next) {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    res.clearCookie('sid');
  }
  next();
});

const sessionChecker = (req, res, next) => {
  if (req.session.user) {
    if (req.originalUrl === '/signin') {
      return res.redirect('/');
    }
    return next();
  }
  if (req.originalUrl === '/signin') {
    return next();
  }
  return res.redirect('/signin');
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(multer().array());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));

app.use('/', sessionChecker, indexRouter);
app.use('/user', sessionChecker, userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

module.exports = app;
