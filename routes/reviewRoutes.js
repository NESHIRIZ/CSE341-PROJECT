import express from 'express';
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import {
  validateReview,
  validateReviewUpdate,
  validateReviewId,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllReviews);
router.get('/:id', validateReviewId, handleValidationErrors, getReviewById);
router.post('/', validateReview, handleValidationErrors, createReview);
router.put('/:id', validateReviewId, validateReviewUpdate, handleValidationErrors, updateReview);
router.delete('/:id', validateReviewId, handleValidationErrors, deleteReview);

export default router;

