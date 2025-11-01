/**
 * @file Item.js
 * @description Mongoose schema definition for auction items. Tracks pricing, scheduling,
 * and status information required for real-time bidding.
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

const auctionDimensionsSchema = new Schema(
  {
    height: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    depth: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    unit: {
      type: String,
      enum: ['inches', 'cm', 'feet', 'meters'],
      default: 'inches'
    }
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required.'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters.'],
      maxlength: [100, 'Title cannot exceed 100 characters.']
    },
    description: {
      type: String,
      required: [true, 'Item description is required.'],
      minlength: [10, 'Description must be at least 10 characters.'],
      maxlength: [2000, 'Description cannot exceed 2000 characters.']
    },
    category: {
      type: String,
      required: [true, 'Item category is required.'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters.']
    },
    images: {
      type: [String],
      required: [true, 'At least one image URL is required.'],
      validate: {
        validator: (imageArray) => Array.isArray(imageArray) && imageArray.length >= 1 && imageArray.length <= 5,
        message: 'Items must have between 1 and 5 images.'
      }
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller ID is required.']
    },
    startingPrice: {
      type: Number,
      required: [true, 'Starting price is required.'],
      min: [1, 'Starting price must be at least $1.']
    },
    currentPrice: {
      type: Number,
      required: true
    },
    bidIncrement: {
      type: Number,
      default: 10,
      min: [1, 'Bid increment must be at least $1.']
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date,
      required: [true, 'Auction end time is required.'],
      validate: {
        validator(endTime) {
          return endTime > this.startTime;
        },
        message: 'End time must be after the start time.'
      }
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'ended', 'cancelled'],
      default: 'active'
    },
    condition: {
      type: String,
      enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
      required: [true, 'Item condition is required.']
    },
    era: {
      type: String,
      trim: true
    },
    authenticity: {
      type: String,
      enum: ['Authenticated', 'Attributed', 'Unverified'],
      default: 'Unverified'
    },
    dimensions: auctionDimensionsSchema,
    highestBidder: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    totalBids: {
      type: Number,
      default: 0,
      min: 0
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isAuctionOver: {
      type: Boolean,
      default: false
    },
    reservePrice: {
      type: Number,
      default: null,
      min: [0, 'Reserve price cannot be negative.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

/**
 * @description Ensure the current price defaults to the starting price when a new item is created.
 */
itemSchema.pre('validate', function synchronizeCurrentPrice(next) {
  if (this.isNew && (this.currentPrice === undefined || this.currentPrice === null)) {
    this.currentPrice = this.startingPrice;
  }
  next();
});

/**
 * @description Maintain the updatedAt timestamp whenever the document changes.
 */
itemSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default Item;
