const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { createUserRules, listUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users.controller');

const router = express.Router();

router.use(protect);
router.get('/', staffOrAdmin, listUsers);
router.get('/:id', staffOrAdmin, getUser);
router.post('/', adminOnly, createUserRules, validate, createUser);
router.patch('/:id', staffOrAdmin, updateUser);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;
