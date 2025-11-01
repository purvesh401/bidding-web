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
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Username must be between 2 and 50 characters long.'),
  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long.'),
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
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters.'),
  body('description')
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters.'),
  body('category')
    .optional({ checkFalsy: true, nullable: true })
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
    .optional({ checkFalsy: true, nullable: true })
    .custom((val, { req }) => {
      // Allow either uploaded files (req.files) or URLs (body.images)
      const hasFiles = Array.isArray(req.files) && req.files.length > 0;
      const hasUrls = Array.isArray(val) || typeof val === 'string' || val == null;
      return hasFiles || hasUrls;
    })
    .withMessage('Provide up to 5 images as files or URLs.'),
  body('startingPrice')
    .optional({ checkFalsy: true, nullable: true })
    .isFloat({ min: 1 })
    .withMessage('Starting price must be at least $1.'),
  body('bidIncrement')
    .optional({ checkFalsy: true, nullable: true })
    .isFloat({ min: 1 })
    .withMessage('Bid increment must be at least $1.'),
  body('endTime')
    .optional({ checkFalsy: true, nullable: true })
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date string.'),
  body('condition')
    .optional({ checkFalsy: true, nullable: true })
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
