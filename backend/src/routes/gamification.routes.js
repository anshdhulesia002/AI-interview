import { Router } from 'express';
import { getGamificationOverview } from '../controllers/gamification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all gamification routes
router.use(verifyJWT);

router.get('/', getGamificationOverview);

export default router;
