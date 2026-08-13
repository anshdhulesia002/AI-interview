import { Router } from 'express';
import {
  registerUser,
  loginUser,
  googleAuthUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  deleteAccount,
  verifyOtp,
  resendOtp,
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { authRateLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../validators/auth.validator.js';

const router = Router();

// Public Auth Routes (Protected by Auth Rate Limiter)
router.post('/register', authRateLimiter, validateRegisterInput, registerUser);
router.post('/login', authRateLimiter, validateLoginInput, loginUser);
router.post('/google', authRateLimiter, googleAuthUser);
router.post('/refresh-token', refreshAccessToken);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.post('/verify-otp', authRateLimiter, verifyOtp);
router.post('/resend-otp', authRateLimiter, resendOtp);

// Protected Auth Routes
router.post('/logout', verifyJWT, logoutUser);
router.get('/me', verifyJWT, getCurrentUser);
router.delete('/account', verifyJWT, deleteAccount);

export default router;
