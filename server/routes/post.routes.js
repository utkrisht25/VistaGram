// routes/post.routes.js
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { createPost, listPosts, toggleLike, getPost } from '../controllers/post.controller.js';

const router = Router();
router.get('/', asyncHandler(listPosts));
router.get('/:id', asyncHandler(getPost));
router.post('/', requireAuth, upload.single('image'), asyncHandler(createPost));
router.post('/:id/like', requireAuth, asyncHandler(toggleLike));
export default router;
