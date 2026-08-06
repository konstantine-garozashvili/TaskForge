import { Router } from 'express';
import apiRoutes from './api.routes.js';
import authRoutes from './auth.routes.js';
import rolesRoutes from './roles.routes.js';
import usersRoutes from './users.routes.js';
import ticketRoutes from './ticket.routes.js';

const router = Router();

// All /api routes are registered here.
// Future modules: /api/tickets (issue #6)...
router.use('/api', apiRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/roles', rolesRoutes);
router.use('/api/users', usersRoutes);
router.use('/api/tickets', ticketRoutes);

export { router as routes };

export default router;
