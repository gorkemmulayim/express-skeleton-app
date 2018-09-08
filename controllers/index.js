const Sequelize = require('../models').Sequelize;
const DataTypes = Sequelize.DataTypes;
const sequelize = require('../models/index').sequelize;
const User = require('../models/user')(sequelize, DataTypes);
const bcrypt = require('bcrypt');

module.exports = {
  getSignUp(req, res, next) {
    res.render('signup');
  },
  postSignUp(req, res, next) {
    if (req.body.password !== req.body.confirmPassword) {
      return res.render('signup', {
        messages: [{
          message: 'Password confirmation doesn\'t match the password!',
          type: 'danger'
        }],
        username: req.body.username
      });
    }
    const user = User.build({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    });
    user.save().then(createdUser => {
      req.session.user = createdUser.dataValues;
      req.session.save(function () {
        res.redirect("/");
      });
    }).catch(sequelize.UniqueConstraintError, function (error) {
      res.render('signup', {
        messages: [{
          message: 'Username is already taken!',
          type: 'danger'
        }],
        username: req.body.username
      });
    });
  },
  getSignIn(req, res, next) {
    res.render('signin');
  },
  postSignIn(req, res, next) {
    User.find({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      if (!user || !user.checkPassword(req.body.password)) {
        return res.render('signin', {
          messages: [{message: 'Username or password is invalid!', type: 'danger'}],
          username: req.body.username
        });
      }
      req.session.user = user.dataValues;
      req.session.save(function () {
        res.redirect("/");
      });
    });
  },
  getSignOut(req, res, next) {
    res.render('signout');
  },
  postSignOut(req, res, next) {
    req.session.destroy();
    res.redirect('/signin');
  }
};
