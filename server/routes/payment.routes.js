const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, webhook } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/webhook', webhook);

module.exports = router;
