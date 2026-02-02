const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const createToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role },     
    process.env.SECRET,
    { expiresIn: '3d' }
  );
};

exports.signup = async (req, res) => {
  const { name, email, password, role, department, phone } = req.body;

  try {
    const user = await User.signup(name, email, password, role, department, phone);

    const token = createToken(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
