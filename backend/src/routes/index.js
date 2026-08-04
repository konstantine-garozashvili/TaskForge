import { Router } from 'express';
import apiRoutes from './api.routes.js';
import authRoutes from './auth.routes.js';
import rolesRoutes from './roles.routes.js';

const router = Router();

// All /api routes are registered here.
// Future modules: /api/users (issue #3), /api/tickets (issue #6)...
router.use('/api', apiRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/roles', rolesRoutes);

export default router;
