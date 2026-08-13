export const STORAGE_KEYS = {
  AUTH_TOKEN: 'interview_ai_token',
  USER_INFO: 'interview_ai_user',
  THEME: 'interview_ai_theme',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  INTERVIEWS: '/interviews',
  REPORT: '/interviews/report',
  PROFILE: '/profile',
  ANALYTICS: '/analytics',
  HISTORY: '/history',
  ACHIEVEMENTS: '/achievements',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  UNAUTHORIZED: '/unauthorized',
};

export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
};
