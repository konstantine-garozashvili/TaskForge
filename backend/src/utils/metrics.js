/**
 * In-memory metrics registry (CDC §6).
 * Tracks HTTP requests, response times and currently connected users
 * (unique authenticated users seen in the last 5 minutes).
 */

const CONNECTED_WINDOW_MS = 5 * 60 * 1000;

const state = {
  startedAt: Date.now(),
  requestsTotal: 0,
  requestDurationSumMs: 0,
  requestDurationCount: 0,
  byMethod: new Map(), // 'GET' -> count
  byStatus: new Map(), // '200' -> count
  activeUsers: new Map(), // userId -> lastSeen timestamp
};

const trackRequest = (method, status, durationMs) => {
  state.requestsTotal += 1;
  state.requestDurationSumMs += durationMs;
  state.requestDurationCount += 1;
  state.byMethod.set(method, (state.byMethod.get(method) || 0) + 1);
  const statusClass = `${Math.floor(status / 100)}xx`;
  state.byStatus.set(statusClass, (state.byStatus.get(statusClass) || 0) + 1);
};

const trackUser = (userId) => {
  state.activeUsers.set(userId, Date.now());
};

const connectedUsers = () => {
  const now = Date.now();
  let count = 0;
  for (const [userId, lastSeen] of state.activeUsers) {
    if (now - lastSeen > CONNECTED_WINDOW_MS) {
      state.activeUsers.delete(userId);
    } else {
      count += 1;
    }
  }
  return count;
};

const averageResponseTimeMs = () =>
  state.requestDurationCount === 0 ? 0 : state.requestDurationSumMs / state.requestDurationCount;

const metrics = {
  trackRequest,
  trackUser,
  connectedUsers,
  averageResponseTimeMs,
  get requestsTotal() {
    return state.requestsTotal;
  },
  get startedAt() {
    return state.startedAt;
  },
  get byMethod() {
    return state.byMethod;
  },
  get byStatus() {
    return state.byStatus;
  },
};

export default metrics;
