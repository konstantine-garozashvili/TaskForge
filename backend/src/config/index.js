import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralized application configuration.
 * All environment variables should be accessed through this module.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://taskforge:taskforge_dev_password@localhost:5434/taskforge',
  jwt: {
    secret: process.env.JWT_SECRET || 'taskforge-dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,
};

export default config;
