const { body } = require('express-validator');
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, listPayload, getPagination, notFound } = require('./response');

const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('total').isNumeric().withMessage('Total is required'),
];

const buildQuery = async (query) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }
  if (query.search) {
    const users = await User.find({
      $or: [
        { name: new RegExp(query.search, 'i') },
        { email: new RegExp(query.search, 'i') },
      ],
    }).select('_id');
    filter.user = { $in: users.map((user) => user._id) };
  }
  return filter;
};

const listOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = await buildQuery(req.query);
  const [items, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  sendSuccess(res, listPayload(items, total, page, limit));
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name price');
  if (!order) throw notFound('Order not found');
  sendSuccess(res, toClient(order));
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);
  sendSuccess(res, toClient(order), 201);
});

const updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!order) throw notFound('Order not found');
  sendSuccess(res, toClient(order));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw notFound('Order not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { orderRules, listOrders, getOrder, createOrder, updateStatus, deleteOrder };
