/**
 * API client - centralized HTTP calls to the TaskForge backend.
 *
 * In development, requests go through the Vite proxy (/api -> localhost:5000).
 */
const API_BASE = '/api';

export const getApiInfo = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};
