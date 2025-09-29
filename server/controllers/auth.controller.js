// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash });
  res.status(201).json({ id: user._id, username: user.username, email: user.email });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).collation({ locale: 'en', strength: 2 });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ token: `dev-token-${user._id}`, user: { id: user._id, username: user.username, email: user.email } });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.auth.userId);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ id: user._id, username: user.username, email: user.email });
};
