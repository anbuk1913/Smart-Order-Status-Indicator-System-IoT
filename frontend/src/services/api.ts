import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/constants';
import { updateLastActivity } from '../utils/tokenUtils';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Update activity on each API request
    updateLastActivity();
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Update activity on successful response
    updateLastActivity();
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      // Clear token and trigger logout
      localStorage.removeItem('token');
      localStorage.removeItem('lastActivity');
      // Dispatch event to trigger logout in components
      window.dispatchEvent(new Event('auth-token-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;