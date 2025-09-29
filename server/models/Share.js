// models/Share.js
import mongoose from 'mongoose';

const ShareSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    byUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    channel: { type: String, enum: ['native', 'copy', 'link'], default: 'link' },
    meta: { type: Object },
  },
  { timestamps: true }
);

ShareSchema.index({ post: 1, createdAt: -1 });

export const Share = mongoose.model('Share', ShareSchema);
