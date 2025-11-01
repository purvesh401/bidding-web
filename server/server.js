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
import watchlistRoutes from './routes/watchlist.routes.js';
import autoBidRoutes from './routes/autoBid.routes.js';
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

// Store active users per auction room
const activeRooms = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // User joins an auction room
  socket.on('join-auction-room', (itemId, userId) => {
    socket.join(`auction_${itemId}`);
    
    // Track active viewers
    if (!activeRooms.has(itemId)) {
      activeRooms.set(itemId, new Set());
    }
    activeRooms.get(itemId).add(socket.id);
    
    // Notify room about viewer count
    const viewerCount = activeRooms.get(itemId).size;
    io.to(`auction_${itemId}`).emit('viewer-count-update', {
      itemId,
      count: viewerCount
    });
    
    console.log(`👥 Socket ${socket.id} joined auction room ${itemId} (${viewerCount} viewers)`);
  });

  // User leaves an auction room
  socket.on('leave-auction-room', (itemId) => {
    socket.leave(`auction_${itemId}`);
    
    // Update viewer count
    if (activeRooms.has(itemId)) {
      activeRooms.get(itemId).delete(socket.id);
      const viewerCount = activeRooms.get(itemId).size;
      
      if (viewerCount === 0) {
        activeRooms.delete(itemId);
      } else {
        io.to(`auction_${itemId}`).emit('viewer-count-update', {
          itemId,
          count: viewerCount
        });
      }
    }
    
    console.log(`🚪 Socket ${socket.id} left auction room ${itemId}`);
  });

  // Real-time chat message
  socket.on('send-auction-message', (data) => {
    const { itemId, message, userName, timestamp } = data;
    io.to(`auction_${itemId}`).emit('new-auction-message', {
      itemId,
      message,
      userName,
      timestamp,
      socketId: socket.id
    });
    console.log(`💬 Chat message in auction ${itemId} from ${userName}`);
  });

  // User is typing indicator
  socket.on('user-typing', (data) => {
    const { itemId, userName, isTyping } = data;
    socket.to(`auction_${itemId}`).emit('user-typing-update', {
      userName,
      isTyping
    });
  });

  // Bid update notification
  socket.on('new-bid-placed', (data) => {
    const { itemId, bidData } = data;
    io.to(`auction_${itemId}`).emit('bid-update', bidData);
    console.log(`💰 New bid placed on item ${itemId}`);
  });

  // Auction ending soon alert
  socket.on('auction-ending-soon', (itemId) => {
    io.to(`auction_${itemId}`).emit('auction-alert', {
      type: 'ending-soon',
      itemId,
      message: 'This auction is ending in 5 minutes!'
    });
  });

  // Watch/Favorite notifications
  socket.on('item-watched', (data) => {
    const { itemId, watchCount } = data;
    io.to(`auction_${itemId}`).emit('watch-count-update', {
      itemId,
      count: watchCount
    });
  });

  // Disconnect handler - clean up all rooms
  socket.on('disconnect', (reason) => {
    console.log(`❌ Socket disconnected (${socket.id}): ${reason}`);
    
    // Remove from all auction rooms
    activeRooms.forEach((viewers, itemId) => {
      if (viewers.has(socket.id)) {
        viewers.delete(socket.id);
        const viewerCount = viewers.size;
        
        if (viewerCount === 0) {
          activeRooms.delete(itemId);
        } else {
          io.to(`auction_${itemId}`).emit('viewer-count-update', {
            itemId,
            count: viewerCount
          });
        }
      }
    });
  });
});

app.set('socketio', io);

/**
 * @description Mount API routes. All routes are versioned under /api for clarity.
 */
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/auto-bids', autoBidRoutes);

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
