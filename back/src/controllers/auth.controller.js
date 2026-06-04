const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient } = require('./response');

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');

  if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  res.cookie('accessToken', token, cookieOptions);
  const userObject = user.toObject();
  delete userObject.password;
  sendSuccess(res, { user: toClient(userObject) });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken', cookieOptions);
  sendSuccess(res, { message: 'Logged out' });
});

const me = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: toClient(req.user) });
});

module.exports = { loginRules, login, logout, me };
