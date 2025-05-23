const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./config/db');
const Route = require('./models/routes.model');
const routeRoutes = require('./routes/routes.routes');
const flightRoutes = require('./routes/flight.routes');
const bookingRoutes = require("./routes/booking.routes");
const reviewRoutes = require('./routes/review.routes');
const luggageRoutes = require("./routes/luggage.routes");
const authRoutes = require('./routes/auth.routes');



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/routes', routeRoutes);
app.use('/api/flights', flightRoutes);
app.use("/api", bookingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api', reviewRoutes);
app.use("/api", luggageRoutes);
app.use('/api/auth', authRoutes);



// DB sync
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('✅ Database synced successfully.');

    // Check if routes already exist to avoid duplicates
    const count = await Route.count();
    if (count === 0) {
      await Route.bulkCreate([
        { from: 'London', to: 'New Delhi' },
        { from: 'Manchester', to: 'Karachi' },
        { from: 'Birmingham', to: 'Paris' },
        { from: 'New York', to: 'Beijing' },
        { from: 'Istanbul', to: 'Riyad' },
        { from: 'London', to: 'Abuja' }
      ]);
      console.log('🚀 Routes inserted successfully.');
    } else {
      console.log('ℹ️ Routes already exist. Skipping insert.');
    }

    // Start the server after syncing and seeding
    app.listen(5000, () => {
      console.log('🌐 Server is listening on port 5000');
    });
  })
  .catch((error) => {
    console.error('❌ Error syncing database:', error);
  });
