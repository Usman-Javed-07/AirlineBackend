const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Flight = sequelize.define('Flight', {
  route: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  arrival_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  vessel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  economy_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  business_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  first_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, {
  tableName: 'flights',
  timestamps: false
});

module.exports = Flight;
