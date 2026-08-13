import axios from 'axios';
import { env } from './env';
import { STORAGE_KEYS } from '../utils/constants';

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/google') ||
      originalRequest?.url?.includes('/auth/forgot-password') ||
      originalRequest?.url?.includes('/auth/reset-password') ||
      originalRequest?.url?.includes('/auth/refresh-token');

    // If 401 error, not already retried, and NOT an auth route
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('interview_ai_refresh_token');
        const response = await axios.post(`${env.apiBaseUrl}/auth/refresh-token`, {
          refreshToken,
        }, { withCredentials: true });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        if (newRefreshToken) {
          localStorage.setItem('interview_ai_refresh_token', newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        localStorage.removeItem('interview_ai_refresh_token');
        return Promise.reject(refreshError);
      }
    }

    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      data: error.response?.data || null,
    };

    return Promise.reject(customError);
  }
);

export default apiClient;
