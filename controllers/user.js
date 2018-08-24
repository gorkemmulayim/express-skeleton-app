const Sequelize = require('sequelize');
const config = require('../config/config');
const DataTypes = Sequelize.DataTypes;
const sequelize = new Sequelize(config[process.env.NODE_ENV]);
const User = require('../models/user')(sequelize, DataTypes);

module.exports = {
  getSignIn(req, res, next) {
    res.render('signin', {message: req.flash('error')});
  },
  postSignIn(req, res, next) {
    return User.find({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      if (!user || !user.checkPassword(req.body.password)) {
        req.flash('error', [{msg: 'Username or password is invalid!'}]);
        res.redirect('signin');
      }
      req.session.user = user.dataValues;
      res.redirect("/");
    });
  }
};
