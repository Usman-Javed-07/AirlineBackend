const express = require('express');
const router = express.Router();
const { getRoutes, addRoute } = require('../controllers/routes.controller');

router.get('/', getRoutes);
router.post('/', addRoute);

module.exports = router;
