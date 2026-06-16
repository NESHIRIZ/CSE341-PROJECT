import Review from '../models/Review.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';

// Get all reviews
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'firstName lastName email')
      .populate('vehicleId', 'make model year price');
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Get review by ID
export const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('vehicleId', 'make model year price');
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }
    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Create new review
export const createReview = async (req, res, next) => {
  try {
    const { userId, vehicleId, rating, comment } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    const review = new Review({
      userId,
      vehicleId,
      rating,
      comment,
    });

    await review.save();
    await review.populate('userId', 'firstName lastName email');
    await review.populate('vehicleId', 'make model year price');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Update review
export const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const updateData = {};

    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email')
      .populate('vehicleId', 'make model year price');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

