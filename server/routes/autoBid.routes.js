/**
 * @file autoBid.routes.js
 * @description Express router for auto-bidding endpoints.
 */

import { Router } from 'express';
import {
  setAutoBid,
  getAutoBid,
  cancelAutoBid,
  getUserAutoBids
} from '../controllers/autoBid.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = Router();

// Set or update auto-bid for an item
router.post('/set', protectRoute, setAutoBid);

// Get auto-bid for a specific item
router.get('/item/:itemId', protectRoute, getAutoBid);

// Cancel auto-bid for a specific item
router.delete('/cancel/:itemId', protectRoute, cancelAutoBid);

// Get all active auto-bids for the user
router.get('/user', protectRoute, getUserAutoBids);

export default router;
