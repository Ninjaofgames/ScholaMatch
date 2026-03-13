import axios from "axios"

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

API.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});
const TOKEN_KEY = 'scholamatch_admin_token';
export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);
export const setAdminToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const adminLogout = () => localStorage.removeItem(TOKEN_KEY);
export const adminLogin = (credentials) => 
  API.post('/auth/admin/login/', credentials).then((res) => res.data);
export const getAdminDashboard = () =>
  API.get('/admin/dashboard').then((res) => res.data);