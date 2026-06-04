const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { shippingRules, listShippingZones, createShippingZone, updateShippingZone, deleteShippingZone } = require('../controllers/shipping.controller');

const router = express.Router();

router.use(protect);
router.get('/', staffOrAdmin, listShippingZones);
router.post('/', staffOrAdmin, shippingRules, validate, createShippingZone);
router.put('/:id', staffOrAdmin, updateShippingZone);
router.delete('/:id', adminOnly, deleteShippingZone);

module.exports = router;
