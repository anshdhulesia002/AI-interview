import { Router } from 'express';
import {
  generateReport,
  getReportByInterviewId,
} from '../controllers/report.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all report routes
router.use(verifyJWT);

router.post('/', generateReport);
router.get('/:interviewId', getReportByInterviewId);

export default router;
