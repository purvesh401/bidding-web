/**
 * @file notFoundHandler.js
 * @description Express middleware that generates a 404 response for unmatched routes.
 */

import createHttpError from 'http-errors';

/**
 * @function notFoundHandler
 * @description Constructs a human-friendly 404 error when no route matches the request.
 * @param {import('express').Request} _req - Incoming Express request object.
 * @param {import('express').Response} _res - Express response object.
 * @param {import('express').NextFunction} next - Callback to pass control to error handler.
 * @returns {void}
 */
const notFoundHandler = (_req, _res, next) => {
  next(createHttpError(404, 'The requested resource could not be found.'));
};

export default notFoundHandler;
