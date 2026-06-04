const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    level: { type: String, default: 'Tous niveaux' },
    duration: { type: String, default: '2h' },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, default: 8, min: 1 },
    imageUrl: { type: String, default: '' },
    dates: [{ type: Date }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workshop', workshopSchema);
