// routes/share.routes.js
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middlewares/auth.js';
import { createShare } from '../controllers/share.controller.js';

const router = Router();
router.post('/', requireAuth, asyncHandler(createShare));
export default router;
