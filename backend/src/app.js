import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import config from './config/index.js';
import openapiSpec from './config/swagger.js';
import routes from './routes/index.js';
import systemRoutes from './routes/system.routes.js';
import { requestLogger } from './middleware/request.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

// --- Global middleware ---
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
app.use(requestLogger); // structured JSON logs + metrics (CDC §6)

// --- API documentation (Swagger UI + raw OpenAPI JSON) ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/api-docs.json', (req, res) => res.json(openapiSpec));

// --- Routes ---
app.use(systemRoutes); // /health, /metrics
app.use(routes); // /api/*

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
