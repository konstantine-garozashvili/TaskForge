import { randomUUID } from 'node:crypto';
import logger from '../utils/logger.js';
import metrics from '../utils/metrics.js';

/**
 * Request middleware (CDC §6):
 * - assigns a unique request_id (also returned in the X-Request-Id header)
 * - logs each completed request as structured JSON
 *   (timestamp, level, message, request_id, user_id, method, path,
 *    status, duration_ms)
 * - feeds the metrics registry (request count, response time,
 *   connected users)
 */
export const requestLogger = (req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-Id', req.id);
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    metrics.trackRequest(req.method, res.statusCode, durationMs);

    // req.user is populated by the authenticate middleware on protected
    // routes — readable here, once the response is finished
    if (req.user?.id) {
      metrics.trackUser(req.user.id);
    }

    logger.info('http_request', {
      request_id: req.id,
      user_id: req.user?.id ?? null,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Math.round(durationMs * 100) / 100,
    });
  });

  next();
};
