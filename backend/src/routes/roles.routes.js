import { Router } from 'express';
import { listRoles } from '../controllers/roles.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

// Admin only — sensitive route restricted by RBAC (issue #2)
router.get('/', authenticate, requireRole('admin'), listRoles);

export default router;
