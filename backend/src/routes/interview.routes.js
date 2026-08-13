import { Router } from 'express';
import {
  createInterview,
  getUserInterviews,
  getInterviewById,
  deleteInterview,
} from '../controllers/interview.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all interview routes
router.use(verifyJWT);

router.post('/', createInterview);
router.get('/', getUserInterviews);
router.get('/:id', getInterviewById);
router.delete('/:id', deleteInterview);

export default router;
