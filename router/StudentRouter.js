const express = require('express');
const studentController = require('../controller/StudentController');
const router = express.Router();

router.get('/student',studentController.RegisterStudent)

module.exports = router;