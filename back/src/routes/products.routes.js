const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { productRules, listProducts, getProduct, createProduct, updateProduct, toggleProduct, deleteProduct } = require('../controllers/products.controller');

const router = express.Router();

router.use(protect);
router.get('/', staffOrAdmin, listProducts);
router.get('/:id', staffOrAdmin, getProduct);
router.post('/', staffOrAdmin, upload.array('images', 8), productRules, validate, createProduct);
router.put('/:id', staffOrAdmin, upload.array('images', 8), updateProduct);
router.patch('/:id/toggle', staffOrAdmin, toggleProduct);
router.delete('/:id', adminOnly, deleteProduct);

module.exports = router;
