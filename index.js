const express = require('express');
const studentRoutes = require('./router/StudentRouter');
const sequelize = require('./config/sequlize')
const port =  3000;


const app = express();


app.use(express.json());
app.use('/api', studentRoutes);

sequelize.sync().then(() => {
  console.log('Connected to the database.');
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


