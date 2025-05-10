// models/Booking.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {
  booking_id: { type: DataTypes.STRING },
  full_name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  dob: { type: DataTypes.DATE },
  passport_number: { type: DataTypes.STRING },
  nationality: { type: DataTypes.STRING },
  passport_issue_date: { type: DataTypes.DATE },
  passport_expiry_date: { type: DataTypes.DATE },
  visa_number: { type: DataTypes.STRING },
  visa_expiry_date: { type: DataTypes.DATE },
  flight_route: { type: DataTypes.STRING },
  flight_class: { type: DataTypes.STRING },
  flight_date: { type: DataTypes.DATE },
  departure_time: { type: DataTypes.STRING },
  arrival_time: { type: DataTypes.STRING },
  vessel: { type: DataTypes.STRING },
  meal_preference: { type: DataTypes.STRING },
  pickup_location: { type: DataTypes.STRING },
  dropoff_location: { type: DataTypes.STRING },
  extras: { type: DataTypes.TEXT },
  total_amount: { type: DataTypes.DECIMAL(10, 2) },
  card_holder: { type: DataTypes.STRING },
  card_number: { type: DataTypes.STRING },
  card_expiry: { type: DataTypes.STRING },
  refund_amount: {type:DataTypes.FLOAT},
  status: {type:DataTypes.STRING},
  checkedIn: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
}

  
});

module.exports = Booking;
