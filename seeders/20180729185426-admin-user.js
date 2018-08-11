'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', [{
      username: 'admin',
      password: '$2b$10$g.Sb45WVVDLGAaxiektV7eLjvKxN3xK3IK1N3I755onJ7rgFxkeiO'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {});
  }
};
