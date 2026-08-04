/**
 * API client - centralized HTTP calls to the TaskForge backend.
 *
 * In development, requests go through the Vite proxy (/api -> localhost:5000).
 * In production, set VITE_API_URL to the deployed backend origin
 * (e.g. https://api.taskforge.example.com/api). Falls back to /api.
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getApiInfo = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};
