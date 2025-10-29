/**
 * @file auctionScheduler.js
 * @description Simple interval-based scheduler that finalizes auctions which reached their end time.
 * Emits Socket.io events so clients can react to auction completion in real time.
 */

import Item from '../models/Item.js';
import Bid from '../models/Bid.js';

const DEFAULT_INTERVAL_MS = 30 * 1000; // 30 seconds for responsive demos

/**
 * @function finalizeExpiredAuctions
 * @description Finds auctions that should be marked as ended and updates their status.
 * @param {import('socket.io').Server} io - Socket.io server instance used to broadcast updates.
 * @returns {Promise<void>}
 */
const finalizeExpiredAuctions = async (io) => {
  const now = new Date();

  const expiredAuctions = await Item.find({
    status: 'active',
    isAuctionOver: false,
    endTime: { $lte: now }
  });

  if (!expiredAuctions.length) {
    return;
  }

  for (const auctionItem of expiredAuctions) {
    auctionItem.isAuctionOver = true;
    auctionItem.status = 'ended';

    if (auctionItem.highestBidder) {
      auctionItem.winnerId = auctionItem.highestBidder;
      const itemBids = await Bid.find({ itemId: auctionItem._id });
      await Promise.all(
        itemBids.map((bid) => {
          bid.bidStatus = bid.bidderId.toString() === auctionItem.highestBidder.toString() ? 'won' : 'lost';
          return bid.save();
        })
      );
    }

    await auctionItem.save();

    io.to(`auction_${auctionItem._id}`).emit('auction-ended', {
      itemId: auctionItem._id,
      winnerId: auctionItem.winnerId,
      finalPrice: auctionItem.currentPrice,
      totalBids: auctionItem.totalBids,
      endedAt: now
    });
  }
};

/**
 * @function initializeAuctionScheduler
 * @description Starts an interval timer responsible for calling finalizeExpiredAuctions.
 * @param {{ io: import('socket.io').Server }} params - Configuration object containing the Socket.io instance.
 * @returns {void}
 */
export const initializeAuctionScheduler = ({ io }) => {
  if (!io) {
    console.warn('Auction scheduler not initialized because Socket.io instance was not provided.');
    return;
  }

  setInterval(() => {
    finalizeExpiredAuctions(io).catch((error) => {
      console.error('Auction scheduler error:', error);
    });
  }, DEFAULT_INTERVAL_MS);
};
