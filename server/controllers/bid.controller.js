/**
 * @file bid.controller.js
 * @description Controllers handling bid placement and history retrieval. Integrates tightly
 * with Socket.io to broadcast real-time updates to connected clients.
 */

import mongoose from 'mongoose';
import Bid from '../models/Bid.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/mailer.js';

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

    // Capture previous highest bidder for outbid notification
    const previousHighestBidder = auctionItem.highestBidder ? auctionItem.highestBidder.toString() : null;

    // Debug: log identities involved in self-bid check
    console.log('Bidder vs Seller check:', {
      bidderId: bidderId?.toString(),
      sellerId: auctionItem.sellerId?.toString(),
      disableAuth: process.env.DISABLE_AUTH
    });

    // In demo mode, skip self-bid restriction because the demo user ID is reused
    if (process.env.DISABLE_AUTH !== 'true' && auctionItem.sellerId.toString() === bidderId.toString()) {
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

    // Send outbid email to previous highest bidder (if configured and different from current bidder)
    try {
      console.log('📧 Checking outbid notification...');
      console.log(`   Previous highest bidder: ${previousHighestBidder}`);
      console.log(`   Current bidder: ${bidderId.toString()}`);
      
      if (previousHighestBidder && previousHighestBidder !== bidderId.toString()) {
        console.log('📧 Previous bidder exists and is different, fetching user...');
        const prevUser = await User.findById(previousHighestBidder).lean();
        console.log(`   Previous user email: ${prevUser?.email}`);
        
        if (prevUser?.email) {
          console.log(`📧 Sending outbid email to: ${prevUser.email}`);
          await sendEmail({
            to: prevUser.email,
            subject: `You've been outbid on ${populatedBid.itemId.title}`,
            text: `Hi ${prevUser.username || 'user'},\n\nYour previous bid on "${populatedBid.itemId.title}" was outbid. The new top bid is $${numericBidAmount}. Visit the auction to place a higher bid.`,
            html: `<p>Hi ${prevUser.username || 'user'},</p><p>Your previous bid on <strong>${populatedBid.itemId.title}</strong> was outbid. The new top bid is <strong>$${numericBidAmount}</strong>.</p><p><a href="${process.env.CLIENT_URL || ''}/items/${itemId}">View auction</a></p>`
          });
        } else {
          console.log('⚠ Previous user has no email address');
        }
      } else {
        console.log('⚠ No outbid notification needed (same bidder or no previous bidder)');
      }
    } catch (notifyErr) {
      console.error('✗ Error attempting to notify previous bidder:', notifyErr);
    }

    res.status(201).json({
      message: 'Bid placed successfully.',
      bid: populatedBid,
      updatedItem: auctionItem.toObject()
    });
  } catch (bidError) {
    if (session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (_) {
        // swallow abort errors (e.g., abort after commit)
      }
    }
    console.error('Error placing bid:', bidError);
    res.status(500).json({ message: 'Server error while placing bid.' });
  } finally {
    try {
      session.endSession();
    } catch (_) {
      // no-op
    }
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
