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
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Dealerships
 *     description: Dealership management
 */

/**
 * @swagger
 * /api/dealerships:
 *   get:
 *     summary: Get all dealerships
 *     tags: [Dealerships]
 *     responses:
 *       200:
 *         description: List of dealerships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Dealership'
 */
router.get('/', getAllDealerships);

/**
 * @swagger
 * /api/dealerships/{id}:
 *   get:
 *     summary: Get a dealership by ID
 *     tags: [Dealerships]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB dealership ID
 *     responses:
 *       200:
 *         description: A single dealership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dealership'
 *       400:
 *         description: Invalid ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Dealership not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateDealershipId, handleValidationErrors, getDealershipById);

/**
 * @swagger
 * /api/dealerships:
 *   post:
 *     summary: Create a new dealership
 *     tags: [Dealerships]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dealership'
 *     responses:
 *       201:
 *         description: Dealership created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', isAuthenticated, validateDealership, handleValidationErrors, createDealership);

/**
 * @swagger
 * /api/dealerships/{id}:
 *   put:
 *     summary: Update an existing dealership
 *     tags: [Dealerships]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB dealership ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dealership'
 *     responses:
 *       200:
 *         description: Dealership updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dealership not found
 */
router.put('/:id', validateDealershipId, isAuthenticated, validateDealershipUpdate, handleValidationErrors, updateDealership);

/**
 * @swagger
 * /api/dealerships/{id}:
 *   delete:
 *     summary: Delete a dealership
 *     tags: [Dealerships]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB dealership ID
 *     responses:
 *       200:
 *         description: Dealership deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dealership not found
 */
router.delete('/:id', validateDealershipId, isAuthenticated, handleValidationErrors, deleteDealership);

export default router;

