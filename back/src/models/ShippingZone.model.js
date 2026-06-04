const mongoose = require('mongoose');

const shippingZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  regions: [String],
  price: { type: Number, required: true, min: 0 },
  minOrderAmount: { type: Number, default: 0, min: 0 },
  estimatedDays: String,
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.models.ShippingZone || mongoose.model('ShippingZone', shippingZoneSchema);
