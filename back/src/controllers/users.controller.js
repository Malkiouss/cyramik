const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const User = require('../models/User.model');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, listPayload, getPagination, notFound } = require('./response');

const createUserRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') },
    ];
  }
  const [items, total] = await Promise.all([
    User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  sendSuccess(res, listPayload(items, total, page, limit));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw notFound('User not found');
  sendSuccess(res, toClient(user));
});

const createUser = asyncHandler(async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 12);
  const user = await User.create({ ...req.body, password: hashed });
  sendSuccess(res, toClient(user), 201);
});

const updateUser = asyncHandler(async (req, res) => {
  const allowed = ['name', 'role', 'isActive', 'avatar'];
  const payload = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).select('-password');
  if (!user) throw notFound('User not found');
  sendSuccess(res, toClient(user));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw notFound('User not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { createUserRules, listUsers, getUser, createUser, updateUser, deleteUser };
