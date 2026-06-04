const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  googleId: { type: String, index: true, sparse: true },
  role: { type: String, enum: ['admin', 'staff', 'client'], default: 'client' },
  isActive: { type: Boolean, default: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
