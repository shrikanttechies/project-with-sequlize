const student = require('../model/StudentModel');
const{Sequelize} = require('sequelize');


const clearOldOtps = async () => {
    const timeBefore = new Date();

    const result = await student.update(
        { otp: null, timeexpire: null },
        { where: { timeexpire: { [Sequelize.Op.lt]: timeBefore } } }
    );

    console.log(`Cleared otps in these rows:- ${result[0]}`, timeBefore);
}

module.exports = {clearOldOtps}