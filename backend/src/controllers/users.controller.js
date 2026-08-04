import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import config from '../config/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USER_SELECT = `
  SELECT u.id, u.name, u.email, u.created_at, r.name AS role
  FROM users u JOIN roles r ON r.id = u.role_id
`;

const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  createdAt: row.created_at,
});

/**
 * GET /api/users (admin)
 * Lists all users with their role.
 */
export const listUsers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`${USER_SELECT} ORDER BY u.id`);
    res.json({ users: rows.map(publicUser) });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id (admin)
 */
export const getUser = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`${USER_SELECT} WHERE u.id = $1`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: publicUser(rows[0]) });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/:id (admin)
 * Body (all optional): { name, email, password, role }
 * Updates profile fields and/or role.
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body || {};

    const { rows: current } = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (current.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password && password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    if (email) {
      const dup = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2', [
        email,
        id,
      ]);
      if (dup.rowCount > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }
    }

    if (role) {
      const { rowCount } = await pool.query('SELECT 1 FROM roles WHERE name = $1', [role]);
      if (rowCount === 0) {
        return res.status(400).json({ error: `Unknown role '${role}'` });
      }
    }

    const updates = [];
    const values = [];
    if (name) {
      values.push(name);
      updates.push(`name = $${values.length}`);
    }
    if (email) {
      values.push(email);
      updates.push(`email = $${values.length}`);
    }
    if (password) {
      values.push(await bcrypt.hash(password, config.bcryptRounds));
      updates.push(`password_hash = $${values.length}`);
    }
    if (role) {
      values.push(role);
      updates.push(`role_id = (SELECT id FROM roles WHERE name = $${values.length})`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length}
       RETURNING id, name, email, created_at,
                 (SELECT name FROM roles WHERE id = users.role_id) AS role`,
      values,
    );

    res.json({ user: publicUser(rows[0]) });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/:id (admin)
 * An admin cannot delete their own account.
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
