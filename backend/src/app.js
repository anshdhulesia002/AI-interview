import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { corsOptions } from './config/cors.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { globalRateLimiter } from './middlewares/rateLimit.middleware.js';
import { sanitizeMiddleware } from './middlewares/sanitize.middleware.js';
import apiRouter from './routes/index.js';
import { ApiError } from './utils/apiError.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// Gzip response compression
app.use(compression());

// Global API rate limiting
app.use(globalRateLimiter);

// CORS configuration
app.use(cors(corsOptions));

// Request body parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// NoSQL Injection & XSS Input Sanitizer
app.use(sanitizeMiddleware);

// Static upload folder serving
app.use('/uploads', express.static('public/temp'));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(requestLogger);
}

// API Routes mounting point
app.use('/api/v1', apiRouter);

// 404 Handler for unknown routes
app.use((_req, _res, next) => {
  next(new ApiError(404, 'API endpoint not found'));
});

// Centralized error middleware
app.use(errorHandler);

export { app };
