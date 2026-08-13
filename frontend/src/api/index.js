import apiClient from '../config/axios';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Centralized API client service wrappers
 */
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
};

export { API_ENDPOINTS };
export default api;
