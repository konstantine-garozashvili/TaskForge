import pg from 'pg';
import config from './index.js';

/**
 * PostgreSQL connection pool.
 * The database runs in Docker (docker compose up -d) — see database/schema.sql.
 */
const pool = new pg.Pool({
  connectionString: config.databaseUrl,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

export default pool;
