import { Router } from 'express';
import { uploadResume, getUserResumes, analyzeResume } from '../controllers/resume.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Protect all resume routes
router.use(verifyJWT);

// Multipart PDF upload with Multer -> Cloudinary -> MongoDB
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getUserResumes);

// Google Gemini AI Resume Analysis routes
router.post('/analyze', analyzeResume);
router.post('/:id/analyze', analyzeResume);

export default router;
