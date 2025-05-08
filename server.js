const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const Route = require('./models/routes.model');
const routeRoutes = require('./routes/routes.routes');
const flightRoutes = require('./routes/flight.routes');



const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/routes', routeRoutes);
app.use('/api/flights', flightRoutes);

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
