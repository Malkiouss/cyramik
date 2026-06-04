const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { orderRules, listOrders, getOrder, createOrder, updateStatus, deleteOrder } = require('../controllers/orders.controller');

const router = express.Router();

router.use(protect);
router.get('/', staffOrAdmin, listOrders);
router.get('/:id', staffOrAdmin, getOrder);
router.post('/', staffOrAdmin, orderRules, validate, createOrder);
router.patch('/:id/status', staffOrAdmin, updateStatus);
router.delete('/:id', adminOnly, deleteOrder);

module.exports = router;
