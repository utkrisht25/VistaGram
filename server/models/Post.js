// models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true, trim: true },
    caption: { type: String, required: true, trim: true, maxlength: 2200 },
    imageUrl: { type: String, required: true },
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1, _id: -1 });
PostSchema.index({ author: 1, createdAt: -1 });

export const Post = mongoose.model('Post', PostSchema);
