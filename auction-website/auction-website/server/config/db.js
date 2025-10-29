/**
 * @file db.js
 * @description MongoDB connection helper using Mongoose. Handles connection logging
 * and retry logic so that the rest of the application can assume a ready database.
 */

import mongoose from 'mongoose';

/**
 * @function connectDatabase
 * @description Establishes a connection to MongoDB using the URI supplied in the
 * environment variables. Exits the process if a connection cannot be established.
 * @returns {Promise<void>} Resolves when the connection is successfully established.
 */
const connectDatabase = async () => {
  const databaseUri = process.env.MONGODB_URI;

  if (!databaseUri) {
    console.error('❌ Missing MONGODB_URI in environment configuration.');
    process.exit(1);
  }

  try {
    await mongoose.connect(databaseUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`✅ Connected to MongoDB at ${mongoose.connection.host}`);
  } catch (connectionError) {
    console.error('❌ Failed to connect to MongoDB:', connectionError);
    process.exit(1);
  }
};

export default connectDatabase;
