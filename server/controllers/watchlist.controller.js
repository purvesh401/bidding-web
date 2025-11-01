/**
 * @file watchlist.controller.js
 * @description Controllers for managing user watchlist/favorites.
 */

import User from '../models/User.js';
import Item from '../models/Item.js';

/**
 * @function addToWatchlist
 * @description Adds an item to user's watchlist
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const addToWatchlist = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    // Check if already in watchlist
    const user = await User.findById(userId);
    if (user.watchlist.includes(itemId)) {
      return res.status(400).json({ message: 'Item already in watchlist.' });
    }

    // Add to watchlist
    user.watchlist.push(itemId);
    await user.save();

    res.status(200).json({ 
      message: 'Item added to watchlist.', 
      watchlist: user.watchlist 
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ message: 'Server error while adding to watchlist.' });
  }
};

/**
 * @function removeFromWatchlist
 * @description Removes an item from user's watchlist
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const removeFromWatchlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user.watchlist.includes(itemId)) {
      return res.status(400).json({ message: 'Item not in watchlist.' });
    }

    // Remove from watchlist
    user.watchlist = user.watchlist.filter(id => id.toString() !== itemId);
    await user.save();

    res.status(200).json({ 
      message: 'Item removed from watchlist.', 
      watchlist: user.watchlist 
    });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    res.status(500).json({ message: 'Server error while removing from watchlist.' });
  }
};

/**
 * @function getWatchlist
 * @description Gets user's watchlist items
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const getWatchlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'watchlist',
      populate: {
        path: 'sellerId',
        select: 'username'
      }
    });

    res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    res.status(500).json({ message: 'Server error while fetching watchlist.' });
  }
};

/**
 * @function toggleWatchlist
 * @description Toggles item in watchlist (add if not present, remove if present)
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const toggleWatchlist = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    const user = await User.findById(userId);
    const isInWatchlist = user.watchlist.includes(itemId);

    if (isInWatchlist) {
      // Remove from watchlist
      user.watchlist = user.watchlist.filter(id => id.toString() !== itemId);
      await user.save();
      return res.status(200).json({ 
        message: 'Item removed from watchlist.', 
        isInWatchlist: false,
        watchlist: user.watchlist 
      });
    } else {
      // Add to watchlist
      user.watchlist.push(itemId);
      await user.save();
      return res.status(200).json({ 
        message: 'Item added to watchlist.', 
        isInWatchlist: true,
        watchlist: user.watchlist 
      });
    }
  } catch (error) {
    console.error('Error toggling watchlist:', error);
    res.status(500).json({ message: 'Server error while toggling watchlist.' });
  }
};
