const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Sequelize instance

const Review = sequelize.define('Review', {
  vessel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comments: {
    type: DataTypes.TEXT,
  }
});

module.exports = Review;
