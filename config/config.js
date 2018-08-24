const Sequelize = require('sequelize');

module.exports = {
  development: {
    logging: console.log,
    database: 'app',
    dialect: 'sqlite',
    storage: 'development.sqlite',
    operatorsAliases: Sequelize.Op
  },
  test: {
    logging: console.log,
    database: 'app',
    dialect: 'sqlite',
    storage: 'test.sqlite',
    operatorsAliases: Sequelize.Op
  },
  production: {
    logging: console.log,
    database: 'app',
    dialect: 'sqlite',
    storage: 'production.sqlite',
    operatorsAliases: Sequelize.Op
  }
};
