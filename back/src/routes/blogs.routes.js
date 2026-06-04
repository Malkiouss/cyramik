const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { optionalAuth, protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { blogRules, listBlogs, getBlog, createBlog, updateBlog, togglePublish, deleteBlog } = require('../controllers/blogs.controller');

const router = express.Router();

router.get('/', optionalAuth, listBlogs);
router.get('/:id', optionalAuth, getBlog);
router.use(protect);
router.post('/', staffOrAdmin, upload.array('images', 1), blogRules, validate, createBlog);
router.put('/:id', staffOrAdmin, upload.array('images', 1), updateBlog);
router.patch('/:id/publish', staffOrAdmin, togglePublish);
router.delete('/:id', adminOnly, deleteBlog);

module.exports = router;
