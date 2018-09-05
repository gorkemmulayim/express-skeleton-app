const Sequelize = require('../models').Sequelize;
const DataTypes = Sequelize.DataTypes;
const sequelize = require('../models/index').sequelize;
const User = require('../models/user')(sequelize, DataTypes);
const bcrypt = require('bcrypt');

module.exports = {
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
