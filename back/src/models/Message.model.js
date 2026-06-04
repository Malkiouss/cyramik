const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromName: { type: String, required: true, trim: true },
  fromEmail: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  repliedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
