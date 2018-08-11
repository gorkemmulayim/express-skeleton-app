var Sequelize = require('sequelize');
var config = require('../config/config');
var DataTypes = Sequelize.DataTypes;
var sequelize = new Sequelize(config[process.env.NODE_ENV]);
var User = require('../models/user')(sequelize, DataTypes);

module.exports = {
  login(req, res, next) {
    return User.find({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      console.log(User);
      if (!user) {
        res.redirect('/');
      } else {
        console.log(User.checkPassword(req.body.password));
        res.send("ok");
      }
    });
  }
};
