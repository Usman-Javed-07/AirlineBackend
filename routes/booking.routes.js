const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");

// Booking creation
router.post("/bookings", bookingController.createBooking);

// Amend booking
router.put("/amend", bookingController.amendBooking);

// Cancel booking
router.put("/cancel", bookingController.cancelBooking);

module.exports = router;
