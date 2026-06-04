const sendSuccess = (res, data, statusCode = 200) => res.status(statusCode).json({ success: true, data });

const toClient = (doc) => {
  if (!doc) return doc;
  const value = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return { ...value, id: String(value._id) };
};

const listPayload = (items, total, page, limit) => ({
  items: items.map(toClient),
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
});

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 50, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const notFound = (message = 'Resource not found') => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

module.exports = { sendSuccess, toClient, listPayload, getPagination, notFound };
