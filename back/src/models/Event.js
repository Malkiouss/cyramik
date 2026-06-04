const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, default: 'Cyramik Studio' },
    imageUrl: { type: String, default: '' },
    price: { type: Number, default: 0, min: 0 },
    capacity: { type: Number, default: 20, min: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
