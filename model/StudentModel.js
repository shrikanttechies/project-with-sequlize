const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequlize');

const student = sequelize.define('student', {

  Roll_No:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  NAME: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EMAIL: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DOB:{
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = student;



