'use strict';

const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'user',
    freezeTableName: true,
    timestamps: false,
  });
  User.prototype.checkPassword = function (password) {
    return password !== undefined && bcrypt.compareSync(password, this.password);
  };
  return User;
};
