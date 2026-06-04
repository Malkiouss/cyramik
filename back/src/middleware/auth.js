const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { asyncHandler } = require('./errorHandler');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

  if (!token) {
    const error = new Error('Authentication required');
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user || !user.isActive) {
    const error = new Error('User is not authorized');
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    return next(error);
  }
  return next();
};

module.exports = {
  protect,
  adminOnly: requireRole('admin'),
  staffOrAdmin: requireRole('admin', 'staff'),
};
