const Booking = require('../models/Booking');

const createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      user: req.user?._id,
    });
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { email: req.user?.email };
    const bookings = await Booking.find(filter)
      .populate('workshop', 'title price duration')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus };
