/**
 * @file Bid.js
 * @description Mongoose schema definition for recorded bids. Captures historical data and
 * supports future analytics such as automatic bidding.
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

const bidSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required for bid placement.']
    },
    bidderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bidder ID is required.']
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required.'],
      min: [1, 'Bid amount must be at least $1.']
    },
    previousPrice: {
      type: Number,
      required: [true, 'Previous price must be recorded for audit purposes.']
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    isAutoBid: {
      type: Boolean,
      default: false
    },
    maxAutoBidAmount: {
      type: Number,
      default: null
    },
    bidStatus: {
      type: String,
      enum: ['active', 'outbid', 'winning', 'won', 'lost', 'retracted'],
      default: 'active'
    },
    isRetracted: {
      type: Boolean,
      default: false
    },
    retractionReason: {
      type: String,
      default: null
    },
    retractionTime: {
      type: Date,
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    }
  },
  {
    versionKey: false
  }
);

const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);

export default Bid;
