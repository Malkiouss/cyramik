const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Message = require('../models/Message.model');
const Workshop = require('../models/Workshop.model');
const Blog = require('../models/Blog.model');
const GiftCard = require('../models/GiftCard.model');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess } = require('./response');

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfWeek = (date) => {
  const day = date.getDay() || 7;
  const copy = startOfDay(date);
  copy.setDate(copy.getDate() - day + 1);
  return copy;
};
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const revenueSince = async (from) => {
  const match = { paymentStatus: 'paid' };
  if (from) match.createdAt = { $gte: from };
  const [result] = await Order.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: '$total' } } }]);
  return result?.total || 0;
};

const getStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const [
    totalRevenue,
    monthRevenue,
    weekRevenue,
    todayRevenue,
    totalOrders,
    activeUsers,
    totalProducts,
    totalMessages,
    unreadMessages,
    activeWorkshops,
    publishedBlogs,
    activeGiftCards,
  ] = await Promise.all([
    revenueSince(),
    revenueSince(startOfMonth(now)),
    revenueSince(startOfWeek(now)),
    revenueSince(startOfDay(now)),
    Order.countDocuments(),
    User.countDocuments({ isActive: true }),
    Product.countDocuments({ isActive: true }),
    Message.countDocuments(),
    Message.countDocuments({ isRead: false }),
    Workshop.countDocuments({ isActive: true }),
    Blog.countDocuments({ published: true }),
    GiftCard.countDocuments({ isActive: true }),
  ]);

  sendSuccess(res, {
    totalRevenue,
    monthRevenue,
    weekRevenue,
    todayRevenue,
    totalOrders,
    activeUsers,
    totalProducts,
    totalMessages,
    unreadMessages,
    activeWorkshops,
    publishedBlogs,
    activeGiftCards,
  });
});

module.exports = { getStats };
