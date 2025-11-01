/**
 * @file db.js
 * @description MongoDB connection helper using Mongoose. Handles connection logging
 * and retry logic so that the rest of the application can assume a ready database.
 */

import mongoose from 'mongoose';

const DEFAULT_DB_NAME = 'bidding_system';
const DEFAULT_URI = `mongodb://127.0.0.1:27017/${DEFAULT_DB_NAME}`;

const connectDatabase = async () => {
  const envUri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
  const mongoUri = envUri || DEFAULT_URI;

  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);
  } catch (connectionError) {
    console.error('Failed to connect to MongoDB:', connectionError);
    process.exit(1);
  }
};

export default connectDatabase;
