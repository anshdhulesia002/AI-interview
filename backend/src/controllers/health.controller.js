import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { getSystemHealth } from '../services/health.service.js';

export const checkHealth = asyncHandler(async (_req, res) => {
  const healthData = await getSystemHealth();
  const statusCode = healthData.status === 'UP' ? 200 : 503;
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, healthData, 'Server health check metrics'));
});
