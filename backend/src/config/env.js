import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || 'development',

  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://localhost:27017/interview-ai',

  jwtSecret:
    process.env.JWT_SECRET ||
    'super-secret-key-change-in-production',

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN || '7d',

  corsOrigin:
    process.env.CORS_ORIGIN || 'http://localhost:5173',

  geminiApiKey:
    process.env.GEMINI_API_KEY || '',

  cloudinaryCloudName:
    process.env.CLOUDINARY_CLOUD_NAME || '',

  cloudinaryApiKey:
    process.env.CLOUDINARY_API_KEY || '',

  cloudinaryApiSecret:
    process.env.CLOUDINARY_API_SECRET || '',
};