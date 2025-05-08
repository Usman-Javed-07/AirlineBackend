const Route = require('../models/routes.model');

// Get all routes
exports.getRoutes = async (req, res) => {
  const routes = await Route.findAll();
  res.json(routes);
};

// Add a route
exports.addRoute = async (req, res) => {
  const { from, to } = req.body;
  const newRoute = await Route.create({ from, to });
  res.status(201).json(newRoute);
};
