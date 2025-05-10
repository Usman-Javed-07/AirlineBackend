const Review = require('../models/review.model');

exports.submitReview = async (req, res) => {
  try {
    const { username, email, vessel, rating, comments } = req.body;

    if (!username || !email || !vessel || !rating || !comments) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const review = await Review.create({
      username,
      email,
      vessel,
      rating,
      comments
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('Submit Review Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};