const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkin.controller');

router.post('/', checkinController.checkIn);

module.exports = router;
