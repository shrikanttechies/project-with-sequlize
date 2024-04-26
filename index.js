const express = require('express');
const studentRoutes = require('./router/StudentRouter');
const sequelize = require('./config/Sequlize');
const cronJobs = require('./cron/Cron')
const cors = require('cors');
const I18n = require('i18n');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT ||8080;

const app = express();



I18n.configure({
  locales: ['en', 'hi'], 
  directory: path.join(__dirname, '/translation'), 
  defaultLocale: 'en', 
});


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(I18n.init);
app.use('/', studentRoutes);


sequelize.sync().then(() => {
  console.log('Connected to the database.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});
cronJobs;


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});