const student = require("../model/StudentModel");
const bcrypt = require('bcrypt');
const nodeMailer = require("nodemailer");
const Mailgen = require("mailgen");
const jwt = require("jsonwebtoken");
const S_key = "qwertygfdsazxcvb";

const createToken = (user) => {
  return jwt.sign({ user }, S_key, { expiresIn: "1h" });
};

const RegisterStudent = async (req, res) => {
  try {
    const { roll_no, name, email, password, dob, contact, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const studentreg = await student.create({
      roll_no,
      name,
      email,
      password :hashedPassword,
      dob,
      contact,
      address,
    });
    const token = createToken(studentreg);
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ token, studentreg, message: res.__("student_create_message") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Studentlogin = async (req, res) => {
  try {
    const { email,password } = req.body;
    const a_student = await student.findOne({ where: { email } });

    if (!a_student) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }
    const passwordMatch = await bcrypt.compare(password ,a_student.password);
    if (!passwordMatch) {
      return res.status(401).json({error:"Invalid Email or Password"})
    }
    const token = createToken(a_student);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ token, a_student, message: res.__("student_login") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const viewStudent = await student.findAll();
    res.status(200).json(viewStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const viewOne = await student.findByPk(req.params.id);
    res.status(200).json({ viewOne, message: res.__("student_detail") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { contact,address } = req.body;

    const updatedStudent = await student.update({ contact,address },{ where: { id }, returning: true });

    if (updatedStudent[0] === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ updatedStudent, message: res.__("student_update") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await student.destroy({ where: { id } });
    res.status(200).json({ message: res.__("student_delete") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ___________________Reset Password By Using Link_______________________________________
const sendMail = async (email, token) => {
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
          instructions: "To change your password, please click the link below:",
          button: {
            color: "#FF3838",
            text: "change password",
            link: `http://localhost:4000/getforgotlink?token=${token}`
          }
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



const Forgot_Pass = async (req, res) => {
  try {
    const { email } = req.body;
    const forgotStudent = await student.findOne({ where: { email } });

    if (!forgotStudent) {
      return res.status(404).json({ error: "User does not exist" });
    }
    const token = createToken(email);
    const mailInfo = await sendMail(email, token); 
    res.status(200).json({ mail: mailInfo, message: res.__("forgot_Password") });
  } catch (error) {
    console.error("Error in Forgot_Pass:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const Get_Forgot_link = async (req, res) => {
  try {
    const token = req.query.token;
    res.cookie("token", token, { httpOnly: true }).status(200).json({message:res.__("forgot_password_get_link")})
  } catch (error) {
    res.status(500).json({error:error.message})
  }
};


const changePassword = async (req, res) => {
  const token = req.cookies.token;
  const pass = req.body.password;

  try {
    const decoded = jwt.verify(token, S_key);
    await student.update( {password:pass} ,{ where: { email: decoded.user }, returning: true });
    res.status(200).json({ message: res.__("Password_Change") });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






const HomePage = async (req, res) => {
  res.send({ message: res.__("message") });
};

module.exports = {
  RegisterStudent,
  Studentlogin,
  getAll,
  getOne,
  update,
  deleteStudent,
  Forgot_Pass,
  Get_Forgot_link,
  changePassword,
  HomePage,
};
