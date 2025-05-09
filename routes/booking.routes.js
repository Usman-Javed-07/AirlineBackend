// const express = require('express');
// const router = express.Router();
// const bookingController = require('../controllers/booking.controller');

// router.post('/', bookingController.createBooking);
// router.get('/', bookingController.getAllBookings);

// module.exports = router;



const express = require("express");
const router = express.Router();
const { createBooking } = require("../controllers/booking.controller");

router.post("/bookings", createBooking);

module.exports = router;
