const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const {
  loginRules,
  registerRules,
  register,
  login,
  googleStart,
  googleCallback,
  logout,
  me,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/google', googleStart);
router.get('/google/callback', googleCallback);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
