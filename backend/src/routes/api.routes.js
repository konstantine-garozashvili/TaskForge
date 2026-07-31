import { Router } from 'express';
import { getApiInfo } from '../controllers/api.controller.js';

const router = Router();

// GET /api - basic API information (used to test frontend <-> backend connection)
router.get('/', getApiInfo);

export default router;
