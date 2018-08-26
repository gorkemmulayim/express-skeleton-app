'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      primaryKey: true,
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
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
