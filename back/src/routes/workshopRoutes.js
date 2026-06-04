const express = require('express');
const Workshop = require('../models/Workshop');
const createCrudController = require('../controllers/crudController');
const { adminOnly, protect } = require('../middleware/authMiddleware');

const controller = createCrudController(Workshop, { publicFilter: () => ({ active: true }) });
const router = express.Router();

router.route('/').get(controller.list).post(protect, adminOnly, controller.create);
router
  .route('/:id')
  .get(controller.get)
  .put(protect, adminOnly, controller.update)
  .delete(protect, adminOnly, controller.remove);

module.exports = router;
