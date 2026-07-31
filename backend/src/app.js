import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

// --- Global middleware ---
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// --- Routes ---
app.use(routes);

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
