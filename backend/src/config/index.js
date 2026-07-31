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
};

export default config;
