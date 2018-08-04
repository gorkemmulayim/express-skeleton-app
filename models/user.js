'use strict';

var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      },
      beforeUpdate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      }
    }
  });
  User.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  return User;
};
