/**
 * @file protectRoute.js
 * @description Middleware that validates JWT tokens stored inside httpOnly cookies
 * and attaches the authenticated user to the request object.
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @function protectRoute
 * @description Ensures that a route can only be accessed by authenticated users.
 * Rejects the request if the token is missing, invalid, or the user cannot be found.
 * @param {import('express').Request} req - Incoming Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Callback to pass control to the next middleware.
 * @returns {Promise<void>}
 */
const protectRoute = async (req, res, next) => {
  try {
    // Allow bypassing authentication in demo mode
    if (process.env.DISABLE_AUTH === 'true') {
      // Use a valid ObjectId-like string to satisfy Mongoose refs in demo mode
      req.user = {
        _id: '000000000000000000000000',
        username: 'Guest',
        role: 'buyer'
      };
      return next();
    }

    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. Authentication token not found.' });
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    const authenticatedUser = await User.findById(decodedPayload.userId).select('-password');

    if (!authenticatedUser) {
      return res.status(401).json({ message: 'Access denied. User account not found.' });
    }

    req.user = authenticatedUser;
    next();
  } catch (authenticationError) {
    if (authenticationError.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication token expired. Please log in again.' });
    }

    if (authenticationError.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid authentication token provided.' });
    }

    console.error('Authentication middleware error:', authenticationError);
    return res.status(500).json({ message: 'Server error while verifying authentication token.' });
  }
};

export default protectRoute;
