const Sequelize = require('../models').Sequelize;
const DataTypes = Sequelize.DataTypes;
const sequelize = require('../models/index').sequelize;
const User = require('../models/user')(sequelize, DataTypes);

module.exports = {
  getSignUp(req, res, next) {
    res.render('signup');
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
