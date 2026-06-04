const Message = require('../models/Message.model');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, listPayload, getPagination, notFound } = require('./response');

const listMessages = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const [items, total] = await Promise.all([
    Message.find().sort({ isRead: 1, createdAt: -1 }).skip(skip).limit(limit),
    Message.countDocuments(),
  ]);
  sendSuccess(res, listPayload(items, total, page, limit));
});

const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) throw notFound('Message not found');
  sendSuccess(res, toClient(message));
});

const markRead = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!message) throw notFound('Message not found');
  sendSuccess(res, toClient(message));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw notFound('Message not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { listMessages, getMessage, markRead, deleteMessage };
