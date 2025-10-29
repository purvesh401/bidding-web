/**
 * @file generateToken.js
 * @description Utility to create JWT tokens and set them inside secure httpOnly cookies.
 */

import jwt from 'jsonwebtoken';

/**
 * @function generateTokenAndSetCookie
 * @description Generates a JWT for the provided user ID and stores it inside an httpOnly cookie.
 * @param {string} userId - MongoDB identifier for the authenticated user.
 * @param {import('express').Response} res - Express response object used to set the cookie.
 * @returns {string} Generated JWT token value.
 */
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return token;
};

export default generateTokenAndSetCookie;
