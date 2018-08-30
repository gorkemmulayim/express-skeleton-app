const Sequelize = require('sequelize');
const config = require('../config/config');
const DataTypes = Sequelize.DataTypes;
const sequelize = new Sequelize(config[process.env.NODE_ENV || 'development']);
const User = require('../models/user')(sequelize, DataTypes);

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
  }
};
