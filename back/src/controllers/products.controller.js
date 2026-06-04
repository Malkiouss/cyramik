const { body } = require('express-validator');
const Product = require('../models/Product.model');
const { uploadToCloudinary } = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, notFound } = require('./response');

const productRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price is required'),
  body('category').isIn(['ceramique', 'goodies', 'lifestyle']).withMessage('Valid category is required'),
];

const parseBody = (body) => ({
  ...body,
  price: body.price !== undefined ? Number(body.price) : body.price,
  stock: body.stock !== undefined ? Number(body.stock) : body.stock,
  isActive: body.isActive === undefined ? body.isActive : body.isActive === true || body.isActive === 'true',
});

const uploadImages = async (files = [], folder) => Promise.all(files.map((file) => uploadToCloudinary(file, folder)));
const canManageProducts = (user) => ['admin', 'staff'].includes(user?.role);

const listProducts = asyncHandler(async (req, res) => {
  const filter = canManageProducts(req.user) ? {} : { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  const products = await Product.find(filter).sort({ createdAt: -1 });
  sendSuccess(res, products.map(toClient));
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || (!product.isActive && !canManageProducts(req.user))) throw notFound('Product not found');
  sendSuccess(res, toClient(product));
});

const createProduct = asyncHandler(async (req, res) => {
  const images = await uploadImages(req.files, 'coffee-arts-paris/products');
  const product = await Product.create({ ...parseBody(req.body), images: images.length ? images : req.body.images });
  sendSuccess(res, toClient(product), 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const images = await uploadImages(req.files, 'coffee-arts-paris/products');
  const payload = parseBody(req.body);
  if (images.length) payload.images = images;
  const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!product) throw notFound('Product not found');
  sendSuccess(res, toClient(product));
});

const toggleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw notFound('Product not found');
  product.isActive = !product.isActive;
  await product.save();
  sendSuccess(res, toClient(product));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw notFound('Product not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { productRules, listProducts, getProduct, createProduct, updateProduct, toggleProduct, deleteProduct };
