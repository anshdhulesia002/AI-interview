import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export const uploadOnCloudinary = async (localFilePath, folder = 'resumes') => {
  if (!localFilePath) return null;

  const fileName = path.basename(localFilePath);
  const localServeUrl = `http://localhost:5000/uploads/${fileName}`;

  try {
    // If Cloudinary keys are demo defaults or unset, serve local uploaded file
    if (
      !config.cloudinaryCloudName ||
      config.cloudinaryCloudName === 'interview-ai-demo' ||
      !config.cloudinaryApiKey
    ) {
      return {
        url: localServeUrl,
        secure_url: localServeUrl,
        public_id: `${folder}/${fileName}`,
        bytes: 1024 * 512,
      };
    }

    // Real Cloudinary Upload Call
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder,
    });

    // Remove local temporary file after Cloudinary upload completes
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.warn('Cloudinary upload warning - Falling back to local storage URL:', error.message);
    return {
      url: localServeUrl,
      secure_url: localServeUrl,
      public_id: `${folder}/${fileName}`,
      bytes: 1024 * 512,
    };
  }
};
