const Sequelize = require('sequelize');
const config = require('../config/config');
const DataTypes = Sequelize.DataTypes;
const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);
const User = require('../models/user')(sequelize, DataTypes);
const bcrypt = require('bcrypt');

module.exports = {
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
      res.redirect("/");
    });
  },
  getUser(req, res, next) {
    res.render('user', {title: req.params.username});
  },
  postUser(req, res, next) {
    User.find({
      where: {
        username: req.session.user.username
      }
    }).then(function (user) {
      if (!user.checkPassword(req.body.oldPassword)) {
        return res.render('user', {messages: [{message: 'Old password isn\'t valid!', type: 'danger'}]});
      }
      if (req.body.newPassword !== req.body.confirmNewPassword) {
        return res.render('user', {
          messages: [{
            message: 'Password confirmation doesn\'t match the new password!',
            type: 'danger'
          }]
        });
      }
      let newPassword = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10));
      User.update({
        password: newPassword,
      }, {
        where: {
          username: req.session.user.username
        }
      }).then(function (affectedCount, affectedRows) {
        res.render('user', {messages: [{message: 'Password changed successfully.', type: 'success'}]});
      });
    });
  }
};
