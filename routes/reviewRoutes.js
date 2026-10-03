const express = require('express');

const { getAllReviews } = require('../controllers/reviewController');
const { createReview } = require('../controllers/reviewController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);
module.exports = router;
