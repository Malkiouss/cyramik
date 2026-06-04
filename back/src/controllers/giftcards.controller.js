const { body } = require('express-validator');
const GiftCard = require('../models/GiftCard.model');
const generateGiftCode = require('../utils/generateGiftCode');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, notFound } = require('./response');

const giftCardRules = [
  body('value').isNumeric().withMessage('Value is required'),
];

const makeUniqueCode = async () => {
  let code = generateGiftCode();
  while (await GiftCard.exists({ code })) code = generateGiftCode();
  return code;
};

const listGiftCards = asyncHandler(async (req, res) => {
  const cards = await GiftCard.find().populate('usedBy', 'name email').sort({ createdAt: -1 });
  sendSuccess(res, cards.map(toClient));
});

const createGiftCard = asyncHandler(async (req, res) => {
  const card = await GiftCard.create({ ...req.body, code: req.body.code || await makeUniqueCode() });
  sendSuccess(res, toClient(card), 201);
});

const updateGiftCard = asyncHandler(async (req, res) => {
  const allowed = ['isActive', 'expiresAt', 'value'];
  const payload = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const card = await GiftCard.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!card) throw notFound('Gift card not found');
  sendSuccess(res, toClient(card));
});

const validateGiftCard = asyncHandler(async (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  const card = await GiftCard.findOne({ code });
  const valid = Boolean(card && card.isActive && !card.usedAt && (!card.expiresAt || card.expiresAt > new Date()));
  sendSuccess(res, { valid, giftCard: valid ? toClient(card) : null });
});

const deleteGiftCard = asyncHandler(async (req, res) => {
  const card = await GiftCard.findByIdAndDelete(req.params.id);
  if (!card) throw notFound('Gift card not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { giftCardRules, listGiftCards, createGiftCard, updateGiftCard, validateGiftCard, deleteGiftCard };
