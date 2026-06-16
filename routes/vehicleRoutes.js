import express from 'express';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import {
  validateVehicle,
  validateVehicleUpdate,
  validateVehicleId,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllVehicles);
router.get('/:id', validateVehicleId, handleValidationErrors, getVehicleById);
router.post('/', validateVehicle, handleValidationErrors, createVehicle);
router.put('/:id', validateVehicleId, validateVehicleUpdate, handleValidationErrors, updateVehicle);
router.delete('/:id', validateVehicleId, handleValidationErrors, deleteVehicle);

export default router;

