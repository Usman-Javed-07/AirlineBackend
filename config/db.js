require('dotenv').config(); // Load .env variables

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,     // 'airline'
  process.env.DB_USER,     // 'root'
  process.env.DB_PASSWORD, // ''
  {
    host: process.env.DB_HOST, // 'localhost'
    dialect: 'mysql'
  }
);

module.exports = sequelize;
