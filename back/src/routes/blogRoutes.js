const express = require('express');
const BlogPost = require('../models/BlogPost');
const createCrudController = require('../controllers/crudController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const controller = createCrudController(BlogPost, {
  lookupBy: 'slug',
  publicFilter: () => ({ published: true }),
});
const router = express.Router();

router.route('/').get(controller.list).post(protect, adminOnly, controller.create);
router.get('/:slug', controller.get);
router.route('/:id').put(protect, adminOnly, controller.update).delete(protect, adminOnly, controller.remove);

module.exports = router;
