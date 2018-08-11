'use strict';

var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    username: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
  }, {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false,
    hooks: {
      beforeCreate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      },
      beforeUpdate: (user, options) => {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
      }
    },
  });
  User.prototype.checkPassword = function (password) {
    return password !== undefined && bcrypt.compareSync(password, this.password);
  };
  return User;
};
