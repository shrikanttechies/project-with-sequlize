const cron = require('node-cron');
const { clearOldOtps } = require("./Task")


cron.schedule('0 0 * * *', () => {
    console.log('Checking and clearing old OTPs...');
    clearOldOtps();
});