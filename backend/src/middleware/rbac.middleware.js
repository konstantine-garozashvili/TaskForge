/**
 * Role-Based Access Control middleware.
 *
 * Role hierarchy (CDC §4): admin > technicien > utilisateur.
 * requireRole('technicien') allows technicien AND admin.
 */

const ROLE_LEVELS = {
  utilisateur: 1,
  technicien: 2,
  admin: 3,
};

/**
 * Builds a middleware that allows only users whose role level
 * is >= the required role's level. Must be used after `authenticate`.
 *
 * @param {'utilisateur'|'technicien'|'admin'} requiredRole
 */
export const requireRole = (requiredRole) => {
  const requiredLevel = ROLE_LEVELS[requiredRole];

  return (req, res, next) => {
    const userLevel = ROLE_LEVELS[req.user?.role];

    if (!userLevel) {
      return res.status(403).json({ error: 'Access denied: unknown role' });
    }
    if (userLevel < requiredLevel) {
      return res.status(403).json({ error: `Access denied: requires role '${requiredRole}'` });
    }
    next();
  };
};
