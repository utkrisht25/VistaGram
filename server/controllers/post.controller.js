// controllers/post.controller.js
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Share } from '../models/Share.js';
import { uploadBuffer } from '../services/uploadImage.js';


export const createPost = async (req, res) => {
  try {
    const { caption, location } = req.body;
    
    // Debug log
    console.log('Request body:', { caption, location });
    console.log('File:', req.file ? { 
      mimetype: req.file.mimetype,
      size: req.file.size,
      originalname: req.file.originalname 
    } : 'No file');

    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ message: 'Image required' });

    console.log('Attempting to upload to Cloudinary...');
    const result = await uploadBuffer(req.file.buffer, 'vistagram/posts');
    console.log('Cloudinary upload result:', { url: result.secure_url });
    const imageUrl = result.secure_url;

    const post = await Post.create({ author: user._id, username: user.username, caption, imageUrl, location });
    console.log('Post created:', post);
    
    res.status(201).json({ id: post._id, imageUrl });
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ 
      message: 'Error creating post', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

export const listPosts = async (req, res) => {
  const { limit = 20, cursor } = req.query;
  const q = {};
  if (cursor) q.$or = [{ createdAt: { $lt: new Date(cursor) } }, { createdAt: new Date(cursor), _id: { $lt: cursor.split('_')[1] } }];
  
  // Get posts
  const posts = await Post.find(q).sort({ createdAt: -1, _id: -1 }).limit(Number(limit));
  const ids = posts.map(p => p._id);
  
  // Get total likes per post
  const likeCounts = await User.aggregate([
    { $unwind: '$likedPosts' },
    { $match: { likedPosts: { $in: ids } } },
    { $group: { _id: '$likedPosts', count: { $sum: 1 } } }
  ]);
  const likesMap = Object.fromEntries(likeCounts.map(l => [String(l._id), l.count]));
  
  // Get share counts
  const shareCounts = await Share.aggregate([
    { $match: { post: { $in: ids } } },
    { $group: { _id: '$post', count: { $sum: 1 } } }
  ]);
  const sharesMap = Object.fromEntries(shareCounts.map(s => [String(s._id), s.count]));
  
  // Get current user's likes
  const me = req.auth?.userId ? await User.findById(req.auth.userId).select('likedPosts') : null;
  const likedSet = new Set(me?.likedPosts?.map(String) || []);
  
  // Format response
  const data = posts.map(p => ({
    id: p._id,
    author: p.author,
    username: p.username,
    caption: p.caption,
    imageUrl: p.imageUrl,
    location: p.location,
    createdAt: p.createdAt,
    likeCount: likesMap[String(p._id)] || 0,
    shareCount: sharesMap[String(p._id)] || 0,
    liked: likedSet.has(String(p._id)),
  }));
  
  const nextCursor = posts.length ? `${posts[posts.length - 1].createdAt.toISOString()}_${posts[posts.length - 1]._id}` : null;
  res.json({ data, nextCursor });
};

export const toggleLike = async (req, res) => {
  const userId = req.auth.userId;
  const postId = req.params.id;
  const user = await User.findById(userId).select('likedPosts');
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  const i = user.likedPosts.findIndex(id => String(id) === postId);
  if (i === -1) user.likedPosts.push(postId);
  else user.likedPosts.splice(i, 1);
  await user.save();
  const liked = i === -1;
  res.json({ liked });
};

export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Not found' });
  const likeCount = await User.countDocuments({ likedPosts: post._id });
  const shareCount = await Share.countDocuments({ post: post._id });
  res.json({
    id: post._id,
    author: post.author,
    username: post.username,
    caption: post.caption,
    imageUrl: post.imageUrl,
    location: post.location,
    createdAt: post.createdAt,
    likeCount,
    shareCount,
  });
};
