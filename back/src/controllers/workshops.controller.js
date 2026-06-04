const { body } = require('express-validator');
const Workshop = require('../models/Workshop.model');
const { uploadToCloudinary } = require('../middleware/upload');
const generateSlug = require('../utils/generateSlug');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, notFound } = require('./response');

const workshopRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('duration').isNumeric().withMessage('Duration is required'),
  body('maxParticipants').isNumeric().withMessage('Max participants is required'),
  body('price').isNumeric().withMessage('Price is required'),
];

const listWorkshops = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.upcoming === 'true') filter.date = { $gte: new Date() };
  const workshops = await Workshop.find(filter).sort({ date: 1 });
  sendSuccess(res, workshops.map(toClient));
});

const uploadImages = async (files = []) => Promise.all(files.map((file) => uploadToCloudinary(file, 'coffee-arts-paris/workshops')));

const uniqueSlug = async (title, ignoreId) => {
  const base = generateSlug(title) || `atelier-${Date.now()}`;
  let slug = base;
  let count = 1;
  while (await Workshop.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) {
    slug = `${base}-${count}`;
    count += 1;
  }
  return slug;
};

const getWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findById(req.params.id);
  if (!workshop) throw notFound('Workshop not found');
  sendSuccess(res, toClient(workshop));
});

const createWorkshop = asyncHandler(async (req, res) => {
  const images = await uploadImages(req.files);
  const workshop = await Workshop.create({
    ...req.body,
    slug: await uniqueSlug(req.body.title),
    images: images.length ? images : req.body.images,
  });
  sendSuccess(res, toClient(workshop), 201);
});

const updateWorkshop = asyncHandler(async (req, res) => {
  const images = await uploadImages(req.files);
  const payload = { ...req.body };
  if (payload.title) payload.slug = await uniqueSlug(payload.title, req.params.id);
  if (images.length) payload.images = images;
  const workshop = await Workshop.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!workshop) throw notFound('Workshop not found');
  sendSuccess(res, toClient(workshop));
});

const enrollWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findOneAndUpdate(
    { _id: req.params.id, $expr: { $lt: ['$enrolled', '$maxParticipants'] } },
    { $inc: { enrolled: 1 } },
    { new: true }
  );
  if (!workshop) throw notFound('Workshop not found or full');
  sendSuccess(res, toClient(workshop));
});

const deleteWorkshop = asyncHandler(async (req, res) => {
  const workshop = await Workshop.findByIdAndDelete(req.params.id);
  if (!workshop) throw notFound('Workshop not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { workshopRules, listWorkshops, getWorkshop, createWorkshop, updateWorkshop, enrollWorkshop, deleteWorkshop };
