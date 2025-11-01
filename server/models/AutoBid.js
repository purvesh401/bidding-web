/**
 * @file AutoBid.js
 * @description Mongoose schema for auto-bidding (proxy bidding) feature.
 * Users can set a maximum bid amount, and the system automatically bids on their behalf.
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * @typedef AutoBidDocument
 * @property {ObjectId} itemId - Reference to the auction item.
 * @property {ObjectId} userId - Reference to the user who set up auto-bidding.
 * @property {number} maxBidAmount - Maximum amount the user is willing to bid.
 * @property {number} currentAutoBidAmount - Current auto-bid amount placed by the system.
 * @property {boolean} isActive - Whether the auto-bid is still active.
 * @property {Date} createdAt - When the auto-bid was created.
 * @property {Date} updatedAt - Last update timestamp.
 */

const autoBidSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required.'],
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
      index: true
    },
    maxBidAmount: {
      type: Number,
      required: [true, 'Maximum bid amount is required.'],
      min: [0, 'Maximum bid amount must be positive.']
    },
    currentAutoBidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current auto-bid amount must be positive.']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure one auto-bid per user per item
autoBidSchema.index({ itemId: 1, userId: 1 }, { unique: true });

// Index for finding active auto-bids for an item
autoBidSchema.index({ itemId: 1, isActive: 1 });

const AutoBid = mongoose.model('AutoBid', autoBidSchema);

export default AutoBid;
