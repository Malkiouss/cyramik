const express = require('express');
const { validate } = require('../middleware/errorHandler');
const { protect, staffOrAdmin, adminOnly } = require('../middleware/auth');
const { giftCardRules, listGiftCards, createGiftCard, updateGiftCard, validateGiftCard, deleteGiftCard } = require('../controllers/giftcards.controller');

const router = express.Router();

router.post('/validate', validateGiftCard);

router.use(protect);
router.get('/', staffOrAdmin, listGiftCards);
router.post('/', staffOrAdmin, giftCardRules, validate, createGiftCard);
router.patch('/:id', staffOrAdmin, updateGiftCard);
router.delete('/:id', adminOnly, deleteGiftCard);

module.exports = router;
