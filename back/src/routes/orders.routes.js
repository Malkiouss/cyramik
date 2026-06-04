const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect, optionalAuth, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { orderRules, reservationRules, statusRules, listOrders, getOrder, createOrder, createReservation, updateStatus, deleteOrder } = require('../controllers/orders.controller');

const router = express.Router();

router.post('/reservations', optionalAuth, reservationRules, validate, createReservation);

router.use(protect);
router.get('/', staffOrAdmin, listOrders);
router.get('/:id', staffOrAdmin, getOrder);
router.post('/', staffOrAdmin, orderRules, validate, createOrder);
router.patch('/:id/status', staffOrAdmin, statusRules, validate, updateStatus);
router.delete('/:id', adminOnly, deleteOrder);

module.exports = router;
