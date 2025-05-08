const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/pay', paymentController.makePayment);
router.post('/refund', paymentController.refund);

module.exports = router;
