// controllers/share.controller.js
import { Share } from '../models/Share.js';
import { Post } from '../models/Post.js';

export const createShare = async (req, res) => {
  const { postId, channel = 'link' } = req.body;
  const exists = await Post.exists({ _id: postId });
  if (!exists) return res.status(404).json({ message: 'Post not found' });
  const byUser = req.auth?.userId || null;
  const s = await Share.create({ post: postId, byUser, channel });
  const count = await Share.countDocuments({ post: postId });
  res.status(201).json({ id: s._id, shareCount: count });
};
