const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { workshopRules, listWorkshops, getWorkshop, createWorkshop, updateWorkshop, enrollWorkshop, deleteWorkshop } = require('../controllers/workshops.controller');

const router = express.Router();

router.use(protect);
router.get('/', staffOrAdmin, listWorkshops);
router.get('/:id', staffOrAdmin, getWorkshop);
router.post('/', staffOrAdmin, upload.array('images', 6), workshopRules, validate, createWorkshop);
router.put('/:id', staffOrAdmin, upload.array('images', 6), updateWorkshop);
router.patch('/:id/enroll', staffOrAdmin, enrollWorkshop);
router.delete('/:id', adminOnly, deleteWorkshop);

module.exports = router;
