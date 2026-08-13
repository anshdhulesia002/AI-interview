import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.mongoUri);
    logger.info(`MongoDB Connected successfully! Host: ${connectionInstance.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection runtime error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

  } catch (error) {
    logger.warn(`MongoDB connection offline (${error.message}). Backend running in standalone mode.`);
  }
};
