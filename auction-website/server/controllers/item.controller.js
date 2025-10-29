/**
 * @file item.controller.js
 * @description Collection of Express controllers handling all auction item operations including
 * creation, retrieval, updates, and deletion.
 */

import Item from '../models/Item.js';
import Bid from '../models/Bid.js';

/**
 * @function createItem
 * @description Creates a new auction item associated with the authenticated seller.
 * @param {import('express').Request} req - Express request object containing item payload.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const createItem = async (req, res) => {
  try {
    if (!['seller', 'both'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Only sellers can create auction listings.' });
    }

    const itemPayload = {
      ...req.body,
      sellerId: req.user._id,
      currentPrice: req.body.startingPrice
    };

    const createdItem = await Item.create(itemPayload);

    res.status(201).json({
      message: 'Auction item created successfully.',
      item: createdItem
    });
  } catch (creationError) {
    console.error('Error creating auction item:', creationError);
    res.status(500).json({ message: 'Server error while creating auction item.' });
  }
};

/**
 * @function getItems
 * @description Retrieves auction items with optional filters such as category, status, and search.
 * @param {import('express').Request} req - Express request object with query parameters.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const getItems = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (status) {
      filters.status = status;
    }

    if (search) {
      filters.title = { $regex: search, $options: 'i' };
    }

    const items = await Item.find(filters)
      .populate('sellerId', 'username role')
      .sort({ createdAt: -1 });

    res.status(200).json({ items });
  } catch (listError) {
    console.error('Error fetching auction items:', listError);
    res.status(500).json({ message: 'Server error while retrieving auction items.' });
  }
};

/**
 * @function getItemById
 * @description Returns a single auction item along with recent bid history.
 * @param {import('express').Request} req - Express request object containing item ID param.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('sellerId', 'username role')
      .populate('highestBidder', 'username');

    if (!item) {
      return res.status(404).json({ message: 'Auction item not found.' });
    }

    const recentBids = await Bid.find({ itemId: id })
      .populate('bidderId', 'username')
      .sort({ timestamp: -1 })
      .limit(20);

    res.status(200).json({ item, recentBids });
  } catch (detailError) {
    console.error('Error retrieving auction item:', detailError);
    res.status(500).json({ message: 'Server error while retrieving auction item.' });
  }
};

/**
 * @function updateItem
 * @description Allows the original seller to update an auction item. Certain fields cannot be
 * modified once the auction has started.
 * @param {import('express').Request} req - Express request object containing update data.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePayload = req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Auction item not found.' });
    }

    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this listing.' });
    }

    if (item.status !== 'upcoming' && item.status !== 'active') {
      return res.status(400).json({ message: 'Only active or upcoming auctions can be updated.' });
    }

    const protectedFields = ['sellerId', 'currentPrice', 'totalBids', 'highestBidder'];
    protectedFields.forEach((field) => delete updatePayload[field]);

    Object.assign(item, updatePayload);
    await item.save();

    res.status(200).json({ message: 'Auction item updated successfully.', item });
  } catch (updateError) {
    console.error('Error updating auction item:', updateError);
    res.status(500).json({ message: 'Server error while updating auction item.' });
  }
};

/**
 * @function deleteItem
 * @description Removes an auction item if no bids have been placed and the requester is the seller.
 * @param {import('express').Request} req - Express request object containing item ID param.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Auction item not found.' });
    }

    if (item.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this listing.' });
    }

    if (item.totalBids > 0) {
      return res.status(400).json({ message: 'Cannot delete an auction that already has bids.' });
    }

    await item.deleteOne();

    res.status(200).json({ message: 'Auction item deleted successfully.' });
  } catch (deleteError) {
    console.error('Error deleting auction item:', deleteError);
    res.status(500).json({ message: 'Server error while deleting auction item.' });
  }
};
