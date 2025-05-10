const express = require("express");
const router = express.Router();
const luggageController = require("../controllers/luggage.controller");

router.post("/luggage", luggageController.checkInLuggage);
router.get("/luggage", luggageController.getAllLuggage);

module.exports = router;
