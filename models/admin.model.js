const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Path to your db.js

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure username is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Sync the model with the database (create the table if it doesn't exist)
sequelize.sync()
  .then(() => console.log('Admin table has been created, if it didn\'t exist'))
  .catch(err => console.error('Unable to create table:', err));

module.exports = Admin;
