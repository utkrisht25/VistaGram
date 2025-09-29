// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, trim: true },
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
);

UserSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
UserSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export const User = mongoose.model('User', UserSchema);
