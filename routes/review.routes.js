// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/review.controller');

// router.post('/', reviewController.postReview);
// router.get('/', reviewController.getReviews);

// module.exports = router;


// routes/review.routes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/reviews', reviewController.submitReview);
router.get('/reviews', reviewController.getAllReviews); 

module.exports = router;
