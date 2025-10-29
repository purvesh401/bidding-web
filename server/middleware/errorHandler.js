/**
 * @file errorHandler.js
 * @description Centralized Express error handling middleware. Ensures consistent
 * error responses and logs necessary details while hiding sensitive information.
 */

/**
 * @function errorHandler
 * @param {Error} err - Error thrown during request processing.
 * @param {import('express').Request} _req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} _next - Express next function (unused by design).
 * @returns {void}
 */
const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.status || err.statusCode || 500;
  const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

  if (statusCode >= 500) {
    console.error('🚨 Internal server error:', err);
  }

  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred.',
    ...(isDevelopment && { stack: err.stack })
  });
};

export default errorHandler;
