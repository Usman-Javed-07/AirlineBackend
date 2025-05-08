const Flight = require('../models/flight.model');

// Add a flight
const addFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ message: 'Flight added successfully', flight });
  } catch (err) {
    console.error('Add flight error:', err);
    res.status(500).json({ error: 'Database error while adding flight' });
  }
};

// Get all flights
const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll();
    res.json(flights);
  } catch (err) {
    console.error('Get flights error:', err);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
};

module.exports = {
  addFlight,
  getAllFlights
};
