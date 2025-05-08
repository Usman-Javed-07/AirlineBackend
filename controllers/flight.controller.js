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

// Update a flight by ID
const updateFlight = async (req, res) => {
    try {
      const flightId = req.params.id;
      const [updated] = await Flight.update(req.body, {
        where: { id: flightId }
      });
  
      if (updated) {
        const updatedFlight = await Flight.findByPk(flightId);
        res.json({ message: 'Flight updated successfully', flight: updatedFlight });
      } else {
        res.status(404).json({ error: 'Flight not found or no changes made' });
      }
    } catch (err) {
      console.error('Update flight error:', err);
      res.status(500).json({ error: 'Database error while updating flight' });
    }
  };
  

module.exports = {
  addFlight,
  getAllFlights,
  updateFlight
};
