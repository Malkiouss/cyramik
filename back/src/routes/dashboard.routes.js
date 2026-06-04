const express = require('express');
const { protect, staffOrAdmin } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/stats', protect, staffOrAdmin, getStats);

module.exports = router;
