const { body } = require('express-validator');
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, listPayload, getPagination, notFound } = require('./response');

const orderRules = [
  body('items').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('total').isNumeric().withMessage('Total is required'),
];

const reservationRules = [
  body('productId').isMongoId().withMessage('Product is required'),
  body('customerName').trim().notEmpty().withMessage('Name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').trim().notEmpty().withMessage('Phone is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const statusRules = [
  body('status').isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid order status'),
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
    filter.$or = [
      { user: { $in: users.map((user) => user._id) } },
      { customerName: new RegExp(query.search, 'i') },
      { customerEmail: new RegExp(query.search, 'i') },
      { customerPhone: new RegExp(query.search, 'i') },
    ];
  }
  return filter;
};

const decorateOrder = (order) => {
  const client = toClient(order);
  const items = client.items || [];
  const products = items
    .map((item) => item.product?.name || item.product)
    .filter(Boolean)
    .join(', ');
  const quantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  return {
    ...client,
    customer: client.customerName || client.user?.name || '-',
    email: client.customerEmail || client.user?.email || '-',
    phone: client.customerPhone || '-',
    products,
    quantity,
  };
};

const ensureStockAvailable = async (items) => {
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      const error = new Error(`${product?.name || 'Product'} does not have enough stock`);
      error.statusCode = 409;
      throw error;
    }
  }
};

const adjustStock = async (items, direction) => {
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: direction * Number(item.quantity || 0) } });
  }
};

const listOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = await buildQuery(req.query);
  const [items, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').populate('items.product', 'name price').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  sendSuccess(res, { ...listPayload(items, total, page, limit), items: items.map(decorateOrder) });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name price');
  if (!order) throw notFound('Order not found');
  sendSuccess(res, decorateOrder(order));
});

const createOrder = asyncHandler(async (req, res) => {
  const order = await Order.create(req.body);
  sendSuccess(res, toClient(order), 201);
});

const createReservation = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity || 1);
  const product = await Product.findOne({ _id: req.body.productId, isActive: true });
  if (!product) throw notFound('Product not found');
  if (product.stock < quantity) {
    const error = new Error('This product does not have enough stock');
    error.statusCode = 409;
    throw error;
  }

  const order = await Order.create({
    user: req.user?._id,
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    customerPhone: req.body.customerPhone,
    customerNote: req.body.customerNote || '',
    source: 'product-reservation',
    items: [{ product: product._id, quantity, price: product.price }],
    total: product.price * quantity,
    status: 'pending',
    paymentMethod: 'reservation',
    paymentStatus: 'unpaid',
  });

  const populated = await order.populate('items.product', 'name price');
  sendSuccess(res, decorateOrder(populated), 201);
});

const updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw notFound('Order not found');

  const previousStatus = order.status;
  const nextStatus = req.body.status;

  if (previousStatus !== 'confirmed' && nextStatus === 'confirmed') {
    await ensureStockAvailable(order.items);
    await adjustStock(order.items, -1);
  }
  if (previousStatus === 'confirmed' && nextStatus === 'cancelled') {
    await adjustStock(order.items, 1);
  }

  order.status = nextStatus;
  await order.save();
  await order.populate('user', 'name email');
  await order.populate('items.product', 'name price');
  sendSuccess(res, decorateOrder(order));
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) throw notFound('Order not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { orderRules, reservationRules, statusRules, listOrders, getOrder, createOrder, createReservation, updateStatus, deleteOrder };
