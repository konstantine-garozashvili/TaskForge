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

const TOKEN_KEY = 'tf_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

/**
 * Shared fetch wrapper: JSON in/out, Bearer token, normalized errors.
 * Throws an Error whose message comes from the backend { error } payload.
 */
const request = async (path, { method = 'GET', body, auth = true } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Erreur API (${response.status})`);
  }
  return data;
};

export const getApiInfo = async () => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
};

/* ---------- Auth (tickets #1-#3 côté backend) ---------- */

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password }, auth: false });

export const register = (name, email, password) =>
  request('/auth/register', { method: 'POST', body: { name, email, password }, auth: false });

export const getMe = () => request('/auth/me');
