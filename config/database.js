const { Sequelize } = require('sequelize');

const db = new Sequelize('myapp2', 'root', 'amit@123', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = db;