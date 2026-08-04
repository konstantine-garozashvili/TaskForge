import pool from '../config/db.js';

/**
 * GET /api/roles (admin only)
 * Lists all roles — used by the admin user management UI (#3).
 */
export const listRoles = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, description FROM roles ORDER BY id');
    res.json({ roles: rows });
  } catch (err) {
    next(err);
  }
};
