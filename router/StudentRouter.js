const express = require('express');
const studentController = require('../controller/StudentController');
const otpController = require('../controller/PasschngControllerOtp')
const authMiddleware = require('../middleware/Authrization');
const router = express.Router();

router.post('/student', studentController.RegisterStudent);
router.post('/studentlogin', studentController.Studentlogin);
router.get('/student',studentController.getAll);
router.get('/student/:id',authMiddleware,studentController.getOne);
router.put('/student/:id',authMiddleware,studentController.update);
router.delete('/student/:id',authMiddleware,studentController.deleteStudent);

// ______________________Forgot Password By Link________________________
router.post('/forgotpassword',studentController.Forgot_Pass);
router.get('/getforgotlink',studentController.Get_Forgot_link);
router.patch('/setnewpassword',studentController.changePassword)

// ______________________Forgot Password By OTP_________________________
router.post('/forgot',otpController.forgetPassword)
router.patch('/reset',otpController.resetPassword)


router.get('/', studentController.HomePage);





module.exports = router;