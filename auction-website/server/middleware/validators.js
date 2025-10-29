/**
 * @file validators.js
 * @description Collection of express-validator chains to ensure consistent input validation
 * across all controllers. Validation rules are intentionally verbose to simplify live edits.
 */

import { body, param, validationResult } from 'express-validator';

/**
 * @function validateRequest
 * @description Middleware that checks the result of previously executed validation chains.
 * If validation errors exist, responds with status 400 and detailed messages.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Callback to continue request processing.
 * @returns {void}
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed. Please review the submitted fields.',
      errors: errors.array()
    });
  }

  next();
};

/**
 * @description Validation chain for user registration payloads.
 */
export const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.'),
  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .withMessage('Password must contain uppercase, lowercase, and numeric characters.'),
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'both'])
    .withMessage('Role must be buyer, seller, or both.'),
  validateRequest
];

/**
 * @description Validation chain for user login payloads.
 */
export const validateUserLogin = [
  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required to log in.'),
  validateRequest
];

/**
 * @description Validation chain for creating or updating auction items.
 */
export const validateItemPayload = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters.'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters.'),
  body('category')
    .isIn([
      'Furniture',
      'Jewelry',
      'Art',
      'Collectibles',
      'Vintage Electronics',
      'Antique Books',
      'Pottery',
      'Watches',
      'Sculptures',
      'Textiles',
      'Musical Instruments',
      'Other'
    ])
    .withMessage('Please select a valid category.'),
  body('images')
    .isArray({ min: 1, max: 5 })
    .withMessage('Please provide between 1 and 5 images.')
    .custom((images) => images.every((imageUrl) => typeof imageUrl === 'string'))
    .withMessage('Image URLs must be strings.'),
  body('startingPrice')
    .isFloat({ min: 1 })
    .withMessage('Starting price must be at least $1.'),
  body('bidIncrement')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Bid increment must be at least $1.'),
  body('endTime')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date string.'),
  body('condition')
    .isIn(['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'])
    .withMessage('Condition must be one of the predefined values.'),
  validateRequest
];

/**
 * @description Validation chain for bid placement payloads.
 */
export const validateBidPlacement = [
  body('itemId')
    .isMongoId()
    .withMessage('Item ID must be a valid MongoDB identifier.'),
  body('bidAmount')
    .isFloat({ min: 1 })
    .withMessage('Bid amount must be at least $1.')
    .custom((value) => Number.isFinite(Number(value)))
    .withMessage('Bid amount must be a numeric value.'),
  validateRequest
];

/**
 * @description Validation chain for object ID route parameters.
 */
export const validateMongoIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Identifier must be a valid MongoDB ObjectId.'),
  validateRequest
];

/**
 * @description Validation chain for routes expecting an itemId parameter.
 */
export const validateItemIdParam = [
  param('itemId')
    .isMongoId()
    .withMessage('Item identifier must be a valid MongoDB ObjectId.'),
  validateRequest
];
