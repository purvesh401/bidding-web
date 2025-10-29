/**
 * @file server.js
 * @description Main Express application entry point. Configures middleware, establishes
 * the MongoDB connection, initializes Socket.io for real-time bidding, mounts API routes,
 * and starts the HTTP server. Every critical configuration step is documented to make
 * live demonstration modifications straightforward.
 */

import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import rateLimit from 'express-rate-limit';

import connectDatabase from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import itemRoutes from './routes/item.routes.js';
import bidRoutes from './routes/bid.routes.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import { initializeAuctionScheduler } from './utils/auctionScheduler.js';

const app = express();

/**
 * @description Apply security-focused HTTP headers using Helmet. This is a baseline
 * configuration that can be expanded during a demo (for example, Content Security Policy changes).
 */
app.use(helmet());

/**
 * @description Configure CORS to allow requests from the React frontend. Credentials
 * are enabled because JWT tokens are stored inside httpOnly cookies.
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  })
);

/**
 * @description Limit repeated requests from the same IP address to protect against
 * brute-force attacks. The values are intentionally easy to adjust when demonstrating.
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

/**
 * @description Parse incoming JSON payloads. The limit is set high enough for detailed
 * auction descriptions while still preventing abuse.
 */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

/**
 * @description Connect to MongoDB. The helper handles logging and exits the process
 * on unrecoverable errors.
 */
await connectDatabase();

/**
 * @description Create HTTP server and attach Socket.io. Socket.io instance is shared
 * with Express controllers via app.set('socketio', io).
 */
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

/**
 * @description Socket.io connection lifecycle handlers. Each listener is documented so the
 * instructor can request modifications such as additional rooms or events.
 */
io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on('join-auction-room', (itemId) => {
    socket.join(`auction_${itemId}`);
    console.log(`👥 Socket ${socket.id} joined auction room ${itemId}`);
  });

  socket.on('leave-auction-room', (itemId) => {
    socket.leave(`auction_${itemId}`);
    console.log(`🚪 Socket ${socket.id} left auction room ${itemId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ Socket disconnected (${socket.id}): ${reason}`);
  });
});

app.set('socketio', io);

/**
 * @description Mount API routes. All routes are versioned under /api for clarity.
 */
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

initializeAuctionScheduler({ io });

/**
 * @description Start the HTTP server. Logs clearly indicate real-time features are enabled.
 */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📡 Socket.io real-time bidding enabled');
});
