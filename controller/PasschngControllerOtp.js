const student = require('../model/StudentModel');
const bcrypt = require('bcrypt');
const nodeMailer = require("nodemailer");
const Mailgen = require("mailgen");
const crypto = require('crypto');




  const sendMail = async (email, otp) => {
    try {
      // Create a nodemailer transporter
      const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
          user: "hunugupta1@gmail.com",
          pass: 'wjmlzrkqpjxprmvu'
        }
      });
  
      // Create a Mailgen instance
      const mailGenerator = new Mailgen({
        theme: "salted",
        product: {
          name: "Your App",
          link: "https://yourapp.com/"
        }
      });
  
      // Generate an email body
      const emailContent = {
        body: {
          name:  "User", // Use provided name or default to "User"
          intro: "Forgot Password",
          action: {
            instructions: `To change your password, enter Otp ${otp}`,
            // button: {
            //   color: "#FF3838",
            //   text: `Enter otp for change password `,
            // //   link: `http://localhost:4000/getforgotlink?token=${token}`
            // }
          },
          outro: "If you have any further concerns or questions, feel free to reply to this email. I appreciate your understanding."
        }
      };
  
      // Generate the HTML content
      const emailBody = mailGenerator.generate(emailContent);
  
      // Send mail with the defined transport object
      let info = await transporter.sendMail({
        from: '"Your App" <yourapp@gmail.com>',
        to: email, 
        subject: "Change Password",
        text: "chang your password by using this link",
        html: emailBody,
      });
  
      console.log("Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error; 
    }
  };


// _______________________________Reset Password By Using Otp__________________________________________________

const forgetPassword = async (req,res) =>{
    try {
        const {email} = req.body;
        const user = await student.findOne({where:{email}});

        if (!user) {
            return res.status(404).json({error:"user dosen't exist!"})
        }
        const generateOtp = crypto.randomInt(100000 , 999999).toString();
        const timeExpire = new Date();
        timeExpire.setMinutes(timeExpire.getMinutes() + 10);
        const hashOtp = await bcrypt.hash(generateOtp,10);
        await user.update({otp:hashOtp,timeexpire:timeExpire});
        await sendMail(email,generateOtp);
        res.status(200).json({message: res.__("send_otp")})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

const resetPassword = async (req,res) =>{
    try {
        const {email,password , otp} = req.body;
        const user = await student.findOne({where:{email}});
        if (!user) {
            return res.status(404).json({error:'User Not Found'})
        }
        if (user.otp === null) {
            return res.status(404).json({message:"Invalid OTP"})
        }
        const compareBcrypt = await bcrypt.compare(otp , user.otp)
        if (compareBcrypt && new Date() < user.timeexpire) {
            const hashPassword = await bcrypt.hash(password , 10);
            await user.update({password:hashPassword , otp: null , timeexpire:null});
            return res.status(201).json({message: res.__("Password_Change")})
        }
        res.status(400).json({message:"Invalid Password or Otp"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};



module.exports = {forgetPassword , resetPassword }