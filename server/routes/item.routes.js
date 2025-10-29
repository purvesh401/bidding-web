/**
 * @file item.routes.js
 * @description Express router defining auction item endpoints.
 */

import { Router } from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
} from '../controllers/item.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { validateItemPayload, validateMongoIdParam } from '../middleware/validators.js';

const router = Router();

router.get('/', getItems);
router.post('/', protectRoute, validateItemPayload, createItem);
router.get('/:id', validateMongoIdParam, getItemById);
router.put('/:id', protectRoute, validateMongoIdParam, validateItemPayload, updateItem);
router.delete('/:id', protectRoute, validateMongoIdParam, deleteItem);

export default router;
