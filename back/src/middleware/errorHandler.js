const { validationResult } = require('express-validator');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map((item) => item.msg).join(', '));
    error.statusCode = 422;
    return next(error);
  }
  return next();
};

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${Object.keys(err.keyPattern || err.keyValue || {}).join(', ') || 'unique field'}`,
      data: null,
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    data: null,
  });
};

module.exports = { asyncHandler, validate, notFound, errorHandler };
