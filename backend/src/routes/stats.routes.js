import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Any authenticated user can view dashboard stats (CDC §5) — no role restriction
router.get('/', authenticate, getStats);

export default router;
