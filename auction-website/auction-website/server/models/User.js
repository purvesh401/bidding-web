/**
 * @file User.js
 * @description Mongoose schema definition for application users. Handles automatic password
 * hashing, enforces validation, and exposes helper methods for authentication checks.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

/**
 * @typedef Address
 * @property {string} street - Optional street information for the user profile.
 * @property {string} city - Optional city field for user mailing address.
 * @property {string} state - Optional state or region information.
 * @property {string} zipCode - Optional postal code string.
 * @property {string} country - Optional country name.
 */

/**
 * @typedef UserDocument
 * @property {string} username - Unique username selected by the user.
 * @property {string} email - Unique email used for authentication.
 * @property {string} password - Hashed password (never stored in plain text).
 * @property {'buyer'|'seller'|'both'} role - Role used to control available features.
 * @property {string} phoneNumber - Optional contact number.
 * @property {Address} address - Structured address information.
 * @property {string|null} profileImage - Optional profile image URL.
 * @property {boolean} isVerified - Indicates if the account has been manually verified.
 * @property {Date} createdAt - Account creation timestamp.
 * @property {Date} lastLogin - Most recent login timestamp.
 * @property {() => Promise<boolean>} comparePassword - Helper method used for authentication.
 */

const addressSchema = new Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true }
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required for account creation.'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long.'],
      maxlength: [30, 'Username cannot exceed 30 characters.']
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters long.']
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'both'],
      default: 'buyer',
      required: true
    },
    phoneNumber: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number.']
    },
    address: addressSchema,
    profileImage: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

/**
 * @description Hash the user password before saving whenever it has been modified.
 */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10);
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

/**
 * @function comparePassword
 * @description Compare a plain-text password with the hashed password stored on the document.
 * @param {string} candidatePassword - Password provided during login.
 * @returns {Promise<boolean>} Resolves to true when the passwords match.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
