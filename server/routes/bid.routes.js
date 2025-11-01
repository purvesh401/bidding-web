/**
 * @file bid.routes.js
 * @description Express router for bid placement and history endpoints.
 */

import { Router } from 'express';
import { placeBid, getBidHistory, getUserBidHistory, retractBid } from '../controllers/bid.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { validateBidPlacement, validateItemIdParam } from '../middleware/validators.js';

const router = Router();

router.post('/', protectRoute, validateBidPlacement, placeBid);
router.get('/history/:itemId', protectRoute, validateItemIdParam, getBidHistory);
router.get('/user/history', protectRoute, getUserBidHistory);
router.post('/retract/:bidId', protectRoute, retractBid);

export default router;
