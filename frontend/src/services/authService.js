import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const TOKEN_KEY = 'scholamatch_token';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const register = async (data) => {
  const response = await api.post('/register/', data);
  return response.data;
};

export const login = async (data) => {
  const response = await api.post('/login/', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile/');
  return response.data;
};

export const getAdminData = async () => {
  const response = await api.get('/admin-data/');
  return response.data;
};

export const getUserData = async () => {
  const response = await api.get('/user-data/');
  return response.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
