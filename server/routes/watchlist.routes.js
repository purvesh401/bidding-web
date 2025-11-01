/**
 * @file watchlist.routes.js
 * @description Express router for watchlist/favorites endpoints.
 */

import { Router } from 'express';
import { 
  addToWatchlist, 
  removeFromWatchlist, 
  getWatchlist,
  toggleWatchlist 
} from '../controllers/watchlist.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = Router();

// All watchlist routes require authentication
router.use(protectRoute);

router.get('/', getWatchlist);
router.post('/add', addToWatchlist);
router.delete('/:itemId', removeFromWatchlist);
router.post('/toggle', toggleWatchlist);

export default router;
