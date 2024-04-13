const student = require("../model/StudentModel");
const jwt = require("jsonwebtoken");
const tokentext = "dsdsdfskfuefkdsnfkdjfcsd";

const createToken = (user) => {
  return jwt.sign({ userId: user._id }, tokentext, { expiresIn: "1h" });
};

// Controller functions
const RegisterStudent = async (req, res) => {
  try {
    const { Roll_No, NAME, EMAIL, DOB } = req.body;
    const studentreg = await student.create({ Roll_No, NAME, EMAIL, DOB });
    const token = createToken(studentreg);
    res.status(201).json({ token, studentreg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { RegisterStudent };
