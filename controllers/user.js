var Sequelize = require('sequelize');
var config = require('../config/config');
var DataTypes = Sequelize.DataTypes;
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
var User = require('../models/user')(sequelize, DataTypes);

module.exports = {
  getSignIn(req, res, next) {
    res.render('signin');
  },
  postSignIn(req, res, next) {
    return User.find({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      if (!user || !user.checkPassword(req.body.password)) {
        res.redirect('signin');
      } else {
        req.session.user = user.dataValues;
        res.send("ok");
      }
    });
  }
};
