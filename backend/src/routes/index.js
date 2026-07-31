import { Router } from 'express';
import apiRoutes from './api.routes.js';

const router = Router();

// All /api routes are registered here.
// Future modules: /api/auth (issue #1), /api/users (issue #3), /api/tickets (issue #6)...
router.use('/api', apiRoutes);

export default router;
