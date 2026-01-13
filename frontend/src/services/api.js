import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  verify: () => 
    api.get('/auth/verify'),
};

export const tablesAPI = {
  getAll: () => 
    api.get('/tables'),
  getById: (id) => 
    api.get(`/tables/${id}`),
  create: (tableName) => 
    api.post('/tables', { tableName }),
  rename: (id, tableName) => 
    api.put(`/tables/${id}/rename`, { tableName }),
  updateStatus: (id, status) => 
    api.put(`/tables/${id}/status`, { status }),
  delete: (id) => 
    api.delete(`/tables/${id}`),
  getDeviceStatus: () => 
    api.get('/device/status'),
};

export default api;