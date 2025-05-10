const Luggage = require("../models/luggage.model");

const db = require("../models/luggage.model");
const Booking = require("../models/booking.model");

exports.checkInLuggage = async (req, res) => {
  const { bookingId, weight, luggageId, numBags } = req.body;

  // Check if bookingId exists in the database
  try {
    const booking = await Booking.findOne({ where: { booking_id: bookingId } });

    if (!booking) {
      return res.status(404).json({ error: "Booking ID not found" });
    }

    // Check if the number of bags exceeds the limit
    if (numBags > 5) {
      return res.status(400).json({ error: "Only a maximum of 5 bags are allowed." });
    }

    // Proceed with luggage creation if booking ID is valid
    const luggage = await Luggage.create({
      bookingId,
      weight,
      luggageTagId: luggageId,
      numBags,
    });

    res.json({ message: "Luggage checked in", luggage });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ error: "Failed to check-in luggage" });
  }
};

// Get all luggage entries
exports.getAllLuggage = async (req, res) => {
  try {
    const luggage = await Luggage.findAll();
    res.json(luggage);
  } catch (err) {
    console.error("Error fetching luggage:", err);
    res.status(500).json({ error: "Failed to fetch luggage data" });
  }
};
