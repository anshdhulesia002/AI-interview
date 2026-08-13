import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import interviewRoutes from './interview.routes.js';
import reportRoutes from './report.routes.js';
import resumeRoutes from './resume.routes.js';
import analyticsRoutes from './analytics.routes.js';
import gamificationRoutes from './gamification.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Mount system routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/interviews', interviewRoutes);
router.use('/reports', reportRoutes);
router.use('/resumes', resumeRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
