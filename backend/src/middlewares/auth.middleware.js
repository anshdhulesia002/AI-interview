import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';

// Fallback demo user ID for unauthenticated dev/testing sessions
const DEMO_USER_ID = '64f1a2b3c4d5e6f7a8b9c0d1';

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    req.user = { _id: DEMO_USER_ID, name: 'john', email: 'john@example.com' };
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.user = {
      ...decodedToken,
      _id: decodedToken._id || decodedToken.id || DEMO_USER_ID,
    };
    next();
  } catch {
    req.user = { _id: DEMO_USER_ID, name: 'john', email: 'john@example.com' };
    next();
  }
});
