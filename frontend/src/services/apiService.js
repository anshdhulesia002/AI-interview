import apiClient from '../config/axios';
import { API_ENDPOINTS } from '../utils/constants';

export const healthCheck = async () => {
  const response = await apiClient.get(API_ENDPOINTS.HEALTH);
  return response.data;
};

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  googleAuth: async (googlePayload) => {
    const response = await apiClient.post('/auth/google', googlePayload);
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
  verifyOtp: async (email, otp) => {
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return response.data;
  },
  resendOtp: async (email) => {
    const response = await apiClient.post('/auth/resend-otp', { email });
    return response.data;
  },
  deleteAccount: async () => {
    const response = await apiClient.delete('/auth/account');
    return response.data;
  },
};

export const interviewService = {
  createInterview: async (interviewData) => {
    const response = await apiClient.post('/interviews', interviewData);
    return response.data;
  },
  getUserInterviews: async () => {
    const response = await apiClient.get('/interviews');
    return response.data;
  },
  getInterviewById: async (id) => {
    const response = await apiClient.get(`/interviews/${id}`);
    return response.data;
  },
  deleteInterview: async (id) => {
    const response = await apiClient.delete(`/interviews/${id}`);
    return response.data;
  },
};

export const reportService = {
  generateReport: async (reportData) => {
    const response = await apiClient.post('/reports', reportData);
    return response.data;
  },
  getReportByInterviewId: async (interviewId) => {
    const response = await apiClient.get(`/reports/${interviewId}`);
    return response.data;
  },
};

export const resumeService = {
  uploadResume: async (formData) => {
    const response = await apiClient.post('/resumes/upload', formData);
    return response.data;
  },
  getUserResumes: async () => {
    const response = await apiClient.get('/resumes');
    return response.data;
  },
  analyzeResume: async (resumeId, targetRole = 'Software Engineer', resumeText = '', fileName = '') => {
    const response = await apiClient.post(`/resumes/${resumeId}/analyze`, { targetRole, resumeText, fileName });
    return response.data;
  },
};

export const analyticsService = {
  getUserAnalytics: async () => {
    const response = await apiClient.get('/analytics');
    return response.data;
  },
};

export const gamificationService = {
  getOverview: async () => {
    const response = await apiClient.get('/gamification');
    return response.data;
  },
};

export const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },
  getInterviews: async () => {
    const response = await apiClient.get('/admin/interviews');
    return response.data;
  },
  deleteInterview: async (id) => {
    const response = await apiClient.delete(`/admin/interviews/${id}`);
    return response.data;
  },
  getReports: async () => {
    const response = await apiClient.get('/admin/reports');
    return response.data;
  },
  deleteReport: async (id) => {
    const response = await apiClient.delete(`/admin/reports/${id}`);
    return response.data;
  },
};

export default {
  healthCheck,
  authService,
  interviewService,
  reportService,
  resumeService,
  analyticsService,
  gamificationService,
  notificationService,
  adminService,
};
