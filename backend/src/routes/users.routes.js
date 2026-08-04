import { Router } from 'express';
import { listUsers, getUser, updateUser, deleteUser } from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

// All user management routes are admin-only (issues #2, #3)
router.use(authenticate, requireRole('admin'));

router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
