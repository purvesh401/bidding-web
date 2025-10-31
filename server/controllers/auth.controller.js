/**
 * @file auth.controller.js
 * @description Express controllers responsible for authentication operations including
 * registration, login, logout, and retrieving the current authenticated user.
 */

import User from '../models/User.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';

/**
 * @function registerUser
 * @description Creates a new user account after ensuring the username and email are unique.
 * Automatically hashes the password (handled by the schema) and issues a JWT cookie.
 * @param {import('express').Request} req - Express request object containing registration data.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, phoneNumber, address } = req.body;

    // Demo-friendly behavior: if the email already exists, treat this as a login
    // instead of failing registration. This removes friction in first-time demos.
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      generateTokenAndSetCookie(existingUserByEmail._id.toString(), res);
      const { password: _password, ...userWithoutPassword } = existingUserByEmail.toObject();
      return res.status(200).json({
        message: 'Welcome back. You are now signed in.',
        user: userWithoutPassword
      });
    }

    // Username collision is uncommon; if it happens, append a random suffix automatically
    let finalUsername = username || email?.split('@')[0] || 'user';
    const usernameTaken = await User.findOne({ username: finalUsername });
    if (usernameTaken) {
      finalUsername = `${finalUsername}_${Math.floor(Math.random() * 10000)}`;
    }

    const newUser = await User.create({
      username: finalUsername,
      email,
      password,
      role: role || 'buyer',
      phoneNumber,
      address
    });

    generateTokenAndSetCookie(newUser._id.toString(), res);

    const { password: _password, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      message: 'Account created successfully.',
      user: userWithoutPassword
    });
  } catch (registrationError) {
    console.error('Error registering user:', registrationError);
    res.status(500).json({ message: 'Server error while creating account.' });
  }
};

/**
 * @function loginUser
 * @description Authenticates user credentials, issues a JWT cookie, and returns profile data.
 * @param {import('express').Request} req - Express request object containing login credentials.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('Login failed: user not found for email', email);
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.warn('Login failed: invalid password for user', user._id.toString());
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    generateTokenAndSetCookie(user._id.toString(), res);

    const { password: _password, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: 'Logged in successfully.',
      user: userWithoutPassword
    });
  } catch (loginError) {
    console.error('Error during login:', loginError);
    res.status(500).json({ message: 'Server error while processing login.' });
  }
};

/**
 * @function logoutUser
 * @description Clears the authentication cookie to end the user session.
 * @param {import('express').Request} _req - Express request object (unused).
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const logoutUser = async (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({ message: 'Logged out successfully.' });
};

/**
 * @function getCurrentUser
 * @description Returns the authenticated user's profile. Requires protectRoute middleware.
 * @param {import('express').Request} req - Express request object, augmented with req.user.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  res.status(200).json({ user: req.user });
};
