import axios from 'axios';

// Use env var if present (Root URL), otherwise fall back to localhost
const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8082';
const API_URL = `${API_ROOT}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
