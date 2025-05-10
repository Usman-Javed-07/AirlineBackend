const Review = require('../models/review.model'); // Correct import

exports.submitReview = async (req, res) => {
  try {
    const { vessel, rating, comments } = req.body;

    if (!vessel || !rating || !comments) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const review = await Review.create({ vessel, rating, comments });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('Submit Review Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
