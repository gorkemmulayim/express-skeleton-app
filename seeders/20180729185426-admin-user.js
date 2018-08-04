'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
          username: 'admin',
          password: '$2b$10$g.Sb45WVVDLGAaxiektV7eLjvKxN3xK3IK1N3I755onJ7rgFxkeiO'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('User', null, {});
  }
};
