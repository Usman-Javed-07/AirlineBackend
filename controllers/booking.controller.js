// controllers/bookingController.js
const { saveBooking } = require("../models/booking.model");
const nodemailer = require("nodemailer");
const Booking = require('../models/booking.model');
const dayjs = require('dayjs');


exports.createBooking = async (req, res) => {
  const data = req.body;

  try {
    const booking = await Booking.create({
      booking_id: data.bookingId,
      full_name: data.personalDetails.fullName,
      email: data.personalDetails.email,
      dob: data.personalDetails.dob,
      passport_number: data.personalDetails.passportNumber,
      nationality: data.personalDetails.nationality,
      passport_issue_date: data.travelDocuments.passportIssueDate,
      passport_expiry_date: data.travelDocuments.passportExpiryDate,
      visa_number: data.travelDocuments.visaNumber,
      visa_expiry_date: data.travelDocuments.visaExpiryDate,
      flight_route: data.flightDetails.route,
      flight_class: data.flightDetails.flightClass,
      flight_date: data.flightDetails.date,
      departure_time: data.flightDetails.departureTime,
      arrival_time: data.flightDetails.arrivalTime,
      vessel: data.flightDetails.vessel,
      meal_preference: data.mealPreference,
      pickup_location: data.pickupLocation,
      dropoff_location: data.dropoffLocation,
      extras: JSON.stringify(data.selectedExtras),
      total_amount: data.totalAmount,
      card_holder: data.payment.cardDetails.name,
      card_number: data.payment.cardDetails.number,
      card_expiry: data.payment.cardDetails.expiry,
      status: 'booked'
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Your Booking Confirmation",
      text: `Dear ${booking.full_name},\n\nYour booking is confirmed!\nBooking ID: ${booking.booking_id}\nFlight Date: ${booking.flight_date}\nRoute: ${booking.flight_route}\n\nThank you for choosing our airline.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Email failed to send:", error);
      else console.log("Confirmation email sent:", info.response);
    });

    res.status(200).json({ message: "Booking created successfully", booking });

  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ error: "Booking failed" });
  }
};

const AMENDMENT_FEE = 100;

exports.amendBooking = async (req, res) => {
  const { bookingId, newFlightDetails, newTicketPrice } = req.body;

  try {
    const booking = await Booking.findOne({ where: { booking_id: bookingId } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const flightDate = new Date(booking.flight_date);
    const now = new Date();
    const hoursDiff = (flightDate - now) / (1000 * 60 * 60);

    if (hoursDiff <= 24) {
      return res.status(400).json({ error: "Cannot amend booking within 24 hours of flight" });
    }

    const oldTicketPrice = booking.total_amount;
    const priceDifference = newTicketPrice - oldTicketPrice;
    const totalAmendmentCost = AMENDMENT_FEE + (priceDifference > 0 ? priceDifference : 0);

    await booking.update({
      ...newFlightDetails,
      total_amount: oldTicketPrice + totalAmendmentCost,
      status: "amended"
    });

    res.status(200).json({
      message: "Booking amended",
      amendment_fee: AMENDMENT_FEE,
      price_difference: priceDifference,
      total_due: totalAmendmentCost
    });

  } catch (error) {
    console.error("Amendment failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  const { bookingId, employeeName } = req.body; // Extract employeeName from the request body

  try {
    const booking = await Booking.findOne({ where: { booking_id: bookingId } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const flightDate = dayjs(booking.flight_date, 'DD/MM/YYYY').toDate();
    const now = new Date();
    const hoursDiff = (flightDate - now) / (1000 * 60 * 60);

    if (hoursDiff <= 24) {
      return res.status(400).json({ error: "Cannot cancel booking within 24 hours of flight" });
    }

    const refundAmount = booking.total_amount * 0.5;
    const cardNumber = booking.card_number;

    // Update the booking status and store the employee's name who canceled it
    await booking.update({
      status: "cancelled",
      refund_amount: refundAmount,
      cancelled_by: employeeName // Store the employee's name
    });

    res.status(200).json({
      message: `Booking cancelled. Refund of £${refundAmount.toFixed(2)} sent to card ending in ${cardNumber.slice(-4)}.`
    });

  } catch (error) {
    console.error("Cancellation failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { booking_id: req.params.bookingId } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateBookingDetails = async (req, res) => {
  const { bookingId, updatedInfo } = req.body;

  try {
    const booking = await Booking.findOne({ where: { booking_id: bookingId } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const flightDate = new Date(booking.flight_date);
    const now = new Date();
    const hoursDiff = (flightDate - now) / (1000 * 60 * 60);

    if (hoursDiff <= 24) {
      return res.status(400).json({ error: "Cannot update booking within 24 hours of flight" });
    }

    await booking.update({
      full_name: updatedInfo.fullName,
      email: updatedInfo.email,
      dob: updatedInfo.dob,
      passport_number: updatedInfo.passportNumber,
      nationality: updatedInfo.nationality,
      passport_issue_date: updatedInfo.passportIssueDate,
      passport_expiry_date: updatedInfo.passportExpiryDate,
      visa_number: updatedInfo.visaNumber,
      visa_expiry_date: updatedInfo.visaExpiryDate,
      meal_preference: updatedInfo.mealPreference,
      pickup_location: updatedInfo.pickupLocation,
      dropoff_location: updatedInfo.dropoffLocation,
      extras: JSON.stringify(updatedInfo.selectedExtras),
      card_holder: updatedInfo.cardName,
      card_number: updatedInfo.cardNumber,
      card_expiry: updatedInfo.cardExpiry
    });

    res.status(200).json({ message: "Booking details updated successfully" });

  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.checkInPassenger = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { bookingId } = req.body;

    if (!bookingId) {
      console.log("Missing bookingId");
      return res.status(400).json({ error: "Booking ID is required" });
    }

    // Find the booking by ID
    const booking = await Booking.findOne({ where: { booking_id: bookingId } });

    if (!booking) {
      console.log("Booking not found for ID:", bookingId);
      return res.status(404).json({ error: "Booking not found" });
    }

    // Get today's date in UTC (YYYY-MM-DD format)
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // Strip out time, ensure it's in UTC

    // Get the flight date from the booking in UTC (YYYY-MM-DD format)
    const flightDate = new Date(booking.flight_date);
    const flightDateString = flightDate.toISOString().split('T')[0]; // Strip out time, ensure it's in UTC

    console.log("Today Date:", todayDate, "Flight Date:", flightDateString); // Check the values of these dates
    console.log("Booking Status:", booking.status);

    // Ensure the booking status is 'booked'
    if (booking.status !== "booked") {
      return res.status(400).json({ error: "Only booked passengers can check-in" });
    }

    // Check if today's date matches the flight date
    if (todayDate !== flightDateString) {
      return res.status(400).json({ error: "You can only check-in on the flight date" });
    }

    // Proceed with check-in
    booking.checkedIn = true;
    await booking.save(); // Save the checked-in status

    // Respond with success message
    res.json({ message: "Check-in successful" });

  } catch (error) {
    console.error("Check-in error:", error); // Log error for better debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// GET /api/bookings/report/:route
exports.getFlightReportByRoute = async (req, res) => {
  const route = req.params.route; // ✅ Use route from URL params
  console.log("Selected Route:", route); 

  try {
    if (!route) {
      return res.status(400).json({ error: "Flight route is required" });
    }

    // Fetch all bookings with the given route
    const bookings = await Booking.findAll({
      where: {
        flight_route: route
      },
      order: [['createdAt', 'DESC']]
    });

    const totalBookings = bookings.length;
    const checkedInCount = bookings.filter(b => b.checkedIn === true).length;
    const missedCount = totalBookings - checkedInCount;
    const totalAmountPaid = bookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

    // Only send necessary fields to frontend
    const simplifiedBookings = bookings.map(b => ({
      booking_id: b.booking_id,
      name: b.full_name,
      checkedIn: b.checkedIn,
      price: Number(b.total_amount || 0).toFixed(2)
    }));

    res.json({
      route,
      report: {
        madeIt: checkedInCount,
        missedIt: missedCount,
        totalPaid: totalAmountPaid.toFixed(2)
      },
      bookings: simplifiedBookings
    });

  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

