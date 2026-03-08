import db from '../config/db.js';

/**
 * Require authenticated user. Use after session middleware.
 * Sets req.user from session userId; returns 401 if not logged in.
 */
export async function requireAuth(req, res, next) {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true },
    });
    if (!user) {
      req.session.userId = undefined;
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
