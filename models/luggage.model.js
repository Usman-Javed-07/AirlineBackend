const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Luggage = sequelize.define('Luggage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  bookingId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  luggageTagId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  numBags: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'luggage',
  timestamps: false
});

module.exports = Luggage;
