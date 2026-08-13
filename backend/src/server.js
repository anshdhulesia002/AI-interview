import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import { app } from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { initSocket } from './socket.js';

const startServer = async () => {
  try {
    // Attempt database connection (graceful fallback if offline local dev)
    await connectDB().catch((err) => {
      logger.warn('Initial MongoDB connection attempt deferred:', err.message);
    });

    const server = app.listen(config.port, () => {
      logger.info(`Interview AI Backend Server running in [${config.nodeEnv}] mode on port: ${config.port}`);
      logger.info(`Health check available at: http://localhost:${config.port}/api/v1/health`);
    });

    // Initialize Socket.io WebSockets Server
    initSocket(server);
    logger.info('⚡ Socket.io WebSockets Engine Initialized');

    // Graceful shutdown handling
    const shutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

startServer();
