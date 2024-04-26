const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('student', 'root', '', {
  host: process.env.HOST,
  dialect: 'mysql',
});

module.exports = sequelize;
