import { Router } from 'express';
import { getUserAnalytics } from '../controllers/analytics.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all analytics routes
router.use(verifyJWT);

router.get('/', getUserAnalytics);

export default router;
