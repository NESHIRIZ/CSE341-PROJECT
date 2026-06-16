import express from 'express';
import {
  getAllDealerships,
  getDealershipById,
  createDealership,
  updateDealership,
  deleteDealership,
} from '../controllers/dealershipController.js';
import {
  validateDealership,
  validateDealershipUpdate,
  validateDealershipId,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllDealerships);
router.get('/:id', validateDealershipId, handleValidationErrors, getDealershipById);
router.post('/', validateDealership, handleValidationErrors, createDealership);
router.put('/:id', validateDealershipId, validateDealershipUpdate, handleValidationErrors, updateDealership);
router.delete('/:id', validateDealershipId, handleValidationErrors, deleteDealership);

export default router;

