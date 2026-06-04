const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, unique: true, sparse: true },
  type: { type: String, enum: ['standard', 'special', 'iftar'], default: 'standard' },
  description: { type: String, default: '' },
  date: { type: Date, required: true },
  duration: { type: Number, required: true, min: 15 },
  maxParticipants: { type: Number, required: true, min: 1 },
  enrolled: { type: Number, default: 0, min: 0 },
  price: { type: Number, required: true, min: 0 },
  location: String,
  images: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Workshop || mongoose.model('Workshop', workshopSchema);
