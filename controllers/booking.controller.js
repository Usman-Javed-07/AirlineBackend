const { saveBooking } = require("../models/booking.model");
const nodemailer = require("nodemailer");
const Booking = require('../models/booking.model'); 


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
      card_expiry: data.payment.cardDetails.expiry
    });

    // ✉️ Set up the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ✉️ Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: "Your Booking Confirmation",
      text: `Dear ${booking.full_name},\n\nYour booking is confirmed!\nBooking ID: ${booking.booking_id}\nFlight Date: ${booking.flight_date}\nRoute: ${booking.flight_route}\n\nThank you for choosing our airline.`
    };

    // ✉️ Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email failed to send:", error);
      } else {
        console.log("Confirmation email sent:", info.response);
      }
    });

    // ✅ Respond after sending
    res.status(200).json({ message: "Booking created successfully", booking });

  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ error: "Booking failed" });
  }
};
