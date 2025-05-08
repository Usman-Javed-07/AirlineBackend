const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flight.controller');

router.post('/', flightController.addFlight);
router.get('/', flightController.getAllFlights);

module.exports = router;
