const { body } = require('express-validator');
const Blog = require('../models/Blog.model');
const generateSlug = require('../utils/generateSlug');
const { uploadToCloudinary } = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const { sendSuccess, toClient, notFound } = require('./response');

const blogRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
];

const uniqueSlug = async (title, ignoreId) => {
  const base = generateSlug(title);
  let slug = base;
  let count = 1;
  while (await Blog.exists({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) {
    slug = `${base}-${count}`;
    count += 1;
  }
  return slug;
};

const canManageBlogs = (user) => ['admin', 'staff'].includes(user?.role);

const listBlogs = asyncHandler(async (req, res) => {
  const filter = canManageBlogs(req.user) ? {} : { published: true };
  if (canManageBlogs(req.user)) {
    if (req.query.published === 'true') filter.published = true;
    if (req.query.published === 'false') filter.published = false;
  }
  const blogs = await Blog.find(filter).populate('author', 'name email').sort({ createdAt: -1 });
  sendSuccess(res, blogs.map(toClient));
});

const getBlog = asyncHandler(async (req, res) => {
  const isObjectId = /^[a-f\d]{24}$/i.test(req.params.id);
  const blog = await Blog.findOne(isObjectId ? { _id: req.params.id } : { slug: req.params.id }).populate('author', 'name email');
  if (!blog || (!blog.published && !canManageBlogs(req.user))) throw notFound('Blog not found');
  sendSuccess(res, toClient(blog));
});

const createBlog = asyncHandler(async (req, res) => {
  const [file] = req.files || [];
  const coverImage = file ? await uploadToCloudinary(file, 'coffee-arts-paris/blogs') : req.body.coverImage;
  const blog = await Blog.create({
    ...req.body,
    slug: await uniqueSlug(req.body.title),
    coverImage,
    author: req.user._id,
    publishedAt: req.body.published === true || req.body.published === 'true' ? new Date() : undefined,
  });
  sendSuccess(res, toClient(blog), 201);
});

const updateBlog = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.title) payload.slug = await uniqueSlug(payload.title, req.params.id);
  const [file] = req.files || [];
  if (file) payload.coverImage = await uploadToCloudinary(file, 'coffee-arts-paris/blogs');
  const blog = await Blog.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!blog) throw notFound('Blog not found');
  sendSuccess(res, toClient(blog));
});

const togglePublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw notFound('Blog not found');
  blog.published = !blog.published;
  blog.publishedAt = blog.published ? new Date() : undefined;
  await blog.save();
  sendSuccess(res, toClient(blog));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw notFound('Blog not found');
  sendSuccess(res, { deleted: true, id: req.params.id });
});

module.exports = { blogRules, listBlogs, getBlog, createBlog, updateBlog, togglePublish, deleteBlog };
