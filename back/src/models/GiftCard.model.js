const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  value: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  usedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.GiftCard || mongoose.model('GiftCard', giftCardSchema);
