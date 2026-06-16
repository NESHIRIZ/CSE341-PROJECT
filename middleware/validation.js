import { body, param, validationResult } from 'express-validator';

// Validation middleware to check for errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// User validation rules
export const validateUser = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'admin'])
    .withMessage('Role must be buyer, seller, or admin'),
];

export const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'admin'])
    .withMessage('Role must be buyer, seller, or admin'),
];

export const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
];

// Vehicle validation rules
export const validateVehicle = [
  body('make')
    .trim()
    .notEmpty()
    .withMessage('Vehicle make is required')
    .isLength({ min: 2 })
    .withMessage('Vehicle make must be at least 2 characters'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required')
    .isLength({ min: 2 })
    .withMessage('Vehicle model must be at least 2 characters'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('mileage')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  body('dealerId')
    .isMongoId()
    .withMessage('Invalid dealer ID'),
];

export const validateVehicleUpdate = [
  body('make')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Vehicle make must be at least 2 characters'),
  body('model')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Vehicle model must be at least 2 characters'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive number'),
  body('dealerId')
    .optional()
    .isMongoId()
    .withMessage('Invalid dealer ID'),
];

export const validateVehicleId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid vehicle ID'),
];

// Dealership validation rules
export const validateDealership = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Dealership name is required')
    .isLength({ min: 2 })
    .withMessage('Dealership name must be at least 2 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ min: 5 })
    .withMessage('Location must be at least 5 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[\d\-\+\(\)\s]+$/)
    .withMessage('Please provide a valid phone number'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
];

export const validateDealershipUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Dealership name must be at least 2 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Location must be at least 5 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\-\+\(\)\s]+$/)
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
];

export const validateDealershipId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid dealership ID'),
];

// Review validation rules
export const validateReview = [
  body('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('vehicleId')
    .isMongoId()
    .withMessage('Invalid vehicle ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
];

export const validateReviewUpdate = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
];

export const validateReviewId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid review ID'),
];
