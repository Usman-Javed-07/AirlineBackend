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
  const { bookingId } = req.body;

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

    await booking.update({
      status: "cancelled",
      refund_amount: refundAmount
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