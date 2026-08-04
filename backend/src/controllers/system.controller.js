import pool from '../config/db.js';
import metrics from '../utils/metrics.js';

/**
 * GET /health (CDC §6)
 * Reports the status of each component: API up, database connected.
 * 200 when everything is up, 503 when a component is down.
 */
export const getHealth = async (req, res) => {
  let database = 'up';
  try {
    await pool.query('SELECT 1');
  } catch {
    database = 'down';
  }

  const healthy = database === 'up';
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    uptime_seconds: Math.floor(process.uptime()),
    checks: {
      api: 'up',
      database,
    },
    timestamp: new Date().toISOString(),
  });
};

/**
 * GET /metrics (CDC §6)
 * Prometheus text exposition format:
 * tickets created, average API response time, connected users,
 * HTTP request counters.
 */
export const getMetrics = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM tickets');
    const ticketsCreated = rows[0].count;

    const lines = [
      '# HELP taskforge_tickets_created_total Total number of tickets created',
      '# TYPE taskforge_tickets_created_total gauge',
      `taskforge_tickets_created_total ${ticketsCreated}`,
      '# HELP taskforge_http_requests_total Total HTTP requests handled',
      '# TYPE taskforge_http_requests_total counter',
      `taskforge_http_requests_total ${metrics.requestsTotal}`,
      '# HELP taskforge_http_request_duration_ms_avg Average API response time in milliseconds',
      '# TYPE taskforge_http_request_duration_ms_avg gauge',
      `taskforge_http_request_duration_ms_avg ${metrics.averageResponseTimeMs().toFixed(2)}`,
      '# HELP taskforge_connected_users Authenticated users active in the last 5 minutes',
      '# TYPE taskforge_connected_users gauge',
      `taskforge_connected_users ${metrics.connectedUsers()}`,
      '# HELP taskforge_uptime_seconds API uptime in seconds',
      '# TYPE taskforge_uptime_seconds gauge',
      `taskforge_uptime_seconds ${Math.floor(process.uptime())}`,
    ];

    for (const [method, count] of metrics.byMethod) {
      lines.push(`taskforge_http_requests_by_method_total{method="${method}"} ${count}`);
    }
    for (const [statusClass, count] of metrics.byStatus) {
      lines.push(`taskforge_http_requests_by_status_total{status_class="${statusClass}"} ${count}`);
    }

    res.type('text/plain; version=0.0.4').send(lines.join('\n') + '\n');
  } catch (err) {
    next(err);
  }
};
