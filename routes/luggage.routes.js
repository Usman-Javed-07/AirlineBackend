const express = require("express");
const router = express.Router();
const luggageController = require("../controllers/luggage.controller");

router.post("/luggage", luggageController.checkInLuggage);

module.exports = router;
