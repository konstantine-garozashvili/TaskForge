import fs from 'node:fs';
import path from 'node:path';

/**
 * Structured JSON logger (CDC §6).
 * Every line is a JSON object: timestamp, level, message,
 * plus optional context (request_id, user_id, ...).
 *
 * Logs are written to stdout/stderr (captured by Docker) AND,
 * when LOG_FILE is set, appended to that file — in production the
 * file lives on the shared Docker volume `logs_data` (centralisation §6).
 */

const logFile = process.env.LOG_FILE || null;
let fileStream = null;

if (logFile) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fileStream = fs.createWriteStream(logFile, { flags: 'a' });
}

const write = (level, message, context = {}) => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    process.stderr.write(line + '\n');
  } else {
    process.stdout.write(line + '\n');
  }
  fileStream?.write(line + '\n');
};

const logger = {
  info: (message, context) => write('info', message, context),
  warn: (message, context) => write('warn', message, context),
  error: (message, context) => write('error', message, context),
};

export default logger;
