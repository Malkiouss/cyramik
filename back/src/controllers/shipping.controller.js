const { body } = require('express-validator');
const ShippingZone = require('../models/ShippingZone.model');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, notFound } = require('./response');

const shippingRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price is required'),
];

const listShippingZones = asyncHandler(async (req, res) => {
  const zones = await ShippingZone.find().sort({ price: 1 });
  sendSuccess(res, zones.map(toClient));
});

const createShippingZone = asyncHandler(async (req, res) => {
  const zone = await ShippingZone.create(req.body);
  sendSuccess(res, toClient(zone), 201);
});

const updateShippingZone = asyncHandler(async (req, res) => {
  const zone = await ShippingZone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!zone) throw notFound('Shipping zone not found');
  sendSuccess(res, toClient(zone));
});

const deleteShippingZone = asyncHandler(async (req, res) => {
  const zone = await ShippingZone.findByIdAndDelete(req.params.id);
  if (!zone) throw notFound('Shipping zone not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { shippingRules, listShippingZones, createShippingZone, updateShippingZone, deleteShippingZone };
