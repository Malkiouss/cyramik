const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { optionalAuth, protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { productRules, listProducts, getProduct, createProduct, updateProduct, toggleProduct, deleteProduct } = require('../controllers/products.controller');

const router = express.Router();

router.get('/', optionalAuth, listProducts);
router.get('/:id', optionalAuth, getProduct);
router.use(protect);
router.post('/', staffOrAdmin, upload.array('images', 8), productRules, validate, createProduct);
router.put('/:id', staffOrAdmin, upload.array('images', 8), updateProduct);
router.patch('/:id/toggle', staffOrAdmin, toggleProduct);
router.delete('/:id', adminOnly, deleteProduct);

module.exports = router;
