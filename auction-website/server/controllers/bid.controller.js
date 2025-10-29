/**
 * @file bid.controller.js
 * @description Controllers handling bid placement and history retrieval. Integrates tightly
 * with Socket.io to broadcast real-time updates to connected clients.
 */

import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Item from '../models/Item.js';

/**
 * @function placeBid
 * @description Validates bid input, ensures auction rules are respected, stores the bid,
 * updates the associated item, and emits Socket.io events for real-time updates.
 * @param {import('express').Request} req - Express request object containing bid data.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const placeBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
  const { itemId, bidAmount } = req.body;
    const bidderId = req.user._id;
  const numericBidAmount = Number(bidAmount);

    const auctionItem = await Item.findById(itemId).session(session);

    if (!auctionItem) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Auction item not found.' });
    }

    if (auctionItem.status !== 'active' || auctionItem.isAuctionOver) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'This auction is no longer active.' });
    }

    if (new Date() >= new Date(auctionItem.endTime)) {
      auctionItem.isAuctionOver = true;
      auctionItem.status = 'ended';
      await auctionItem.save({ session });
      await session.commitTransaction();
      return res.status(400).json({ message: 'Auction has already ended.' });
    }

    if (auctionItem.sellerId.toString() === bidderId.toString()) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Sellers cannot bid on their own items.' });
    }

    const minimumBidAmount = auctionItem.currentPrice + auctionItem.bidIncrement;

    if (!Number.isFinite(numericBidAmount) || numericBidAmount < minimumBidAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Minimum bid is $${minimumBidAmount}.`
      });
    }

    const bidDocument = await Bid.create([
      {
        itemId,
        bidderId,
        bidAmount: numericBidAmount,
        previousPrice: auctionItem.currentPrice,
        ipAddress: req.ip
      }
    ], { session });

  auctionItem.currentPrice = numericBidAmount;
    auctionItem.highestBidder = bidderId;
    auctionItem.totalBids += 1;
    auctionItem.updatedAt = new Date();
    await auctionItem.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populatedBid = await Bid.findById(bidDocument[0]._id)
      .populate('bidderId', 'username')
      .populate('itemId', 'title');

    const broadcastData = {
      itemId,
  newPrice: numericBidAmount,
      previousPrice: populatedBid.previousPrice,
      bidderId: bidderId,
      bidderUsername: populatedBid.bidderId.username,
      totalBids: auctionItem.totalBids,
      bidIncrement: auctionItem.bidIncrement,
      timestamp: populatedBid.timestamp,
      bidId: populatedBid._id
    };

    const socketIo = req.app.get('socketio');
    socketIo.to(`auction_${itemId}`).emit('new-bid-placed', broadcastData);

    res.status(201).json({
      message: 'Bid placed successfully.',
      bid: populatedBid,
      updatedItem: auctionItem.toObject()
    });
  } catch (bidError) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error placing bid:', bidError);
    res.status(500).json({ message: 'Server error while placing bid.' });
  }
};

/**
 * @function getBidHistory
 * @description Returns paginated bid history for a specific auction item, ordered by most recent.
 * @param {import('express').Request} req - Express request object containing params and query.
 * @param {import('express').Response} res - Express response object used to send the response.
 * @returns {Promise<void>}
 */
export const getBidHistory = async (req, res) => {
  try {
    const { itemId } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;

    const [bids, totalBids] = await Promise.all([
      Bid.find({ itemId })
        .populate('bidderId', 'username')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      Bid.countDocuments({ itemId })
    ]);

    res.status(200).json({
      bids,
      pagination: {
        page,
        limit,
        totalBids,
        totalPages: Math.ceil(totalBids / limit) || 1
      }
    });
  } catch (historyError) {
    console.error('Error retrieving bid history:', historyError);
    res.status(500).json({ message: 'Server error while retrieving bid history.' });
  }
};
