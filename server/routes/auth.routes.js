// routes/auth.routes.js
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(getMe));
export default router;
