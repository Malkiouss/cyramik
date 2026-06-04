const express = require('express');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { listMessages, getMessage, markRead, deleteMessage } = require('../controllers/messages.controller');

const router = express.Router();

router.use(protect);
router.get('/', staffOrAdmin, listMessages);
router.get('/:id', staffOrAdmin, getMessage);
router.patch('/:id/read', staffOrAdmin, markRead);
router.delete('/:id', adminOnly, deleteMessage);

module.exports = router;
