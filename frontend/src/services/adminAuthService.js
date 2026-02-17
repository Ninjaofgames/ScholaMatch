import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const ADMIN_TOKEN_KEY = 'scholamatch_admin_token';

const adminApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      if (!window.location.pathname.includes('/admin')) {
        return Promise.reject(error);
      }
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const adminLogin = async (data) => {
  const response = await adminApi.post('/admin/login/', data);
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await adminApi.get('/admin/dashboard/');
  return response.data;
};

export const getActivityLogs = async () => {
  const response = await adminApi.get('/admin/activity-logs/');
  return response.data;
};

export const adminPasswordResetRequest = async (email) => {
  const response = await adminApi.post('/admin/password-reset/request/', { email });
  return response.data;
};

export const adminPasswordResetConfirm = async (data) => {
  const response = await adminApi.post('/admin/password-reset/confirm/', data);
  return response.data;
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
