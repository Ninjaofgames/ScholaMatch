import axios, { mergeConfig } from "axios";

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});
API.interceptors.request.use((config) => {
  const token = getUserToken();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});
const TOKEN_KEY = 'scholamatch_user_token';
export const getUserToken = () => localStorage.getItem(TOKEN_KEY);
export const setUserToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const userLogout = () => localStorage.removeItem(TOKEN_KEY);
export const userLogin = (credentials) =>
  API.post('/auth/login/', credentials).then((res) => res.data);
export const register = (credentials) =>
  API.post('/auth/register/', credentials).then((res) => res.data);
export const getUserProfile = (credentials) =>
  API.post('/auth/profile/', credentials).then((res) => res.data);
export const verifyEmail = (email, code) =>
  API.post('/auth/verify-email/', { email, code }).then((res) => res.data);
export const resendCode = (email) =>
  API.post('/auth/resend-code/', { email }).then((res) => res.data);