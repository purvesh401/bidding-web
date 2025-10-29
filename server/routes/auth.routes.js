/**
 * @file auth.routes.js
 * @description Express router mapping authentication-related endpoints to controller functions.
 */

import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';
import { validateUserRegistration, validateUserLogin } from '../middleware/validators.js';

const router = Router();

router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.post('/logout', protectRoute, logoutUser);
router.get('/me', protectRoute, getCurrentUser);

export default router;
