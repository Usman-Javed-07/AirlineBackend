const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");

// Booking creation
router.post("/bookings", bookingController.createBooking);

// Amend booking
router.put("/amend", bookingController.amendBooking);

// Cancel booking
router.put("/cancel", bookingController.cancelBooking);

// Get booking by ID
router.get("/bookings/:bookingId", bookingController.getBookingById);

router.put("/update-details", bookingController.updateBookingDetails);



module.exports = router;
