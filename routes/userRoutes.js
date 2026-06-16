import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  validateUser,
  validateUserUpdate,
  validateUserId,
  handleValidationErrors,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', validateUserId, handleValidationErrors, getUserById);
router.post('/', validateUser, handleValidationErrors, createUser);
router.put('/:id', validateUserId, validateUserUpdate, handleValidationErrors, updateUser);
router.delete('/:id', validateUserId, handleValidationErrors, deleteUser);

export default router;

