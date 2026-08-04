/**
 * API client - centralized HTTP calls to the TaskForge backend.
 *
 * In development, requests go through the Vite proxy (/api -> localhost:5000).
 * In production builds, the fallback is the Railway API — the URL is public
 * and baking it into the source keeps every build pipeline deterministic
 * (VITE_API_URL remains available as an override if the backend moves).
 */
const PRODUCTION_API_URL = 'https://backend-production-d4bd5.up.railway.app/api';

const API_BASE =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_API_URL : '/api');

export const getApiInfo = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};
