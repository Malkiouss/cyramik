const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect } = require('../middleware/auth');
const { loginRules, login, logout, me } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', loginRules, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
