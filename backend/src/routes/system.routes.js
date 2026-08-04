import { Router } from 'express';
import { getHealth, getMetrics } from '../controllers/system.controller.js';

const router = Router();

// Technical endpoints (CDC §6) — public, no auth required
router.get('/health', getHealth);
router.get('/metrics', getMetrics);

export default router;
