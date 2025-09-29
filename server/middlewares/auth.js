// middlewares/auth.js
export const requireAuth = (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token || !token.startsWith('dev-token-')) return res.status(401).json({ message: 'Unauthorized' });
  req.auth = { userId: token.replace('dev-token-', '') };
  next();
};
