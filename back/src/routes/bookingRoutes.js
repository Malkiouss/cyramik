const express = require('express');
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createBooking);
router.get('/', protect, getBookings);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
