import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import config from '../config/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ROLE = 'utilisateur';

const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  createdAt: row.created_at,
});

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * Creates a user with the default role 'utilisateur' (RG6: password is bcrypt-hashed).
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, config.bcryptRounds);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, role_id)
       VALUES ($1, $2, $3, (SELECT id FROM roles WHERE name = $4))
       RETURNING id, name, email, created_at,
                 (SELECT name FROM roles WHERE id = users.role_id) AS role`,
      [name, email, passwordHash, DEFAULT_ROLE],
    );

    const user = publicUser(rows[0]);
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns a JWT and the user profile.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.created_at, r.name AS role
       FROM users u JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`,
      [email],
    );

    const user = rows[0];
    // Same error message for unknown email and wrong password (no user enumeration)
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const profile = publicUser(user);
    const token = signToken(profile);
    res.json({ user: profile, token });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns the profile of the authenticated user (requires Bearer token).
 */
export const me = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at, r.name AS role
       FROM users u JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1`,
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: publicUser(rows[0]) });
  } catch (err) {
    next(err);
  }
};
