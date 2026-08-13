import { Router } from 'express';
import {
  getSystemStats,
  getAllUsers,
  deleteUser,
  getAllInterviews,
  deleteAdminInterview,
  getAllReports,
  deleteAdminReport,
} from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all admin routes
router.use(verifyJWT);

router.get('/stats', getSystemStats);

// Users Management Routes
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Interviews Management Routes
router.get('/interviews', getAllInterviews);
router.delete('/interviews/:id', deleteAdminInterview);

// Reports Management Routes
router.get('/reports', getAllReports);
router.delete('/reports/:id', deleteAdminReport);

export default router;
