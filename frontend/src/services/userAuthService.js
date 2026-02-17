import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const USER_TOKEN_KEY = 'scholamatch_user_token';

const userApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(USER_TOKEN_KEY);
      if (!window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register') &&
          !window.location.pathname.includes('/verify')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const register = async (data) => {
  const response = await userApi.post('/register/', data);
  return response.data;
};

export const verifyEmail = async (email, code) => {
  const response = await userApi.post('/verify-email/', { email, code });
  return response.data;
};

export const resendCode = async (email) => {
  const response = await userApi.post('/resend-code/', { email });
  return response.data;
};

export const userLogin = async (data) => {
  const response = await userApi.post('/user/login/', data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await userApi.get('/user/profile/');
  return response.data;
};

export const updateProfile = async (data) => {
  const config = data instanceof FormData
    ? { transformRequest: [(d, h) => { delete h['Content-Type']; return d; }] }
    : {};
  const response = await userApi.patch('/user/profile/update/', data, config);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await userApi.post('/user/change-password/', data);
  return response.data;
};

export const passwordResetRequest = async (email) => {
  const response = await userApi.post('/password-reset/request/', { email });
  return response.data;
};

export const passwordResetConfirm = async (data) => {
  const response = await userApi.post('/password-reset/confirm/', data);
  return response.data;
};

export const userLogout = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
};

export const setUserToken = (token) => {
  localStorage.setItem(USER_TOKEN_KEY, token);
};

export const getUserToken = () => localStorage.getItem(USER_TOKEN_KEY);
