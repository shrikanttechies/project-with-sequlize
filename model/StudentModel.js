const { DataTypes } = require('sequelize');
const sequelize = require('../config/Sequlize');

const student = sequelize.define('student-detail', {

  roll_no:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  dob:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  address:{
    type: DataTypes.STRING,
    allowNull:false,
  },
  otp:{
    type:DataTypes.STRING,
    allowNull:true,
  },
  timeexpire:{
    type:DataTypes.DATE,
    allowNull:true,
  }
});


module.exports = student;