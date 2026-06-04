const express = require('express');
const { createContactMessage, getContactMessages } = require('../controllers/contactController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createContactMessage);
router.get('/', protect, adminOnly, getContactMessages);

module.exports = router;
