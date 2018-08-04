'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('User', {
      username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
