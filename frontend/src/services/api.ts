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
    updateLastActivity();
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    updateLastActivity();
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastActivity');
      window.dispatchEvent(new Event('auth-token-expired'));
    }
    return Promise.reject(error);
  }
);

export default api;