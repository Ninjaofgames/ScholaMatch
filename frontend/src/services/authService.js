import axios from "axios";
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});
const TOKEN_KEY = 'scholamatch_token';
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const logout = () => sessionStorage.removeItem(TOKEN_KEY);
export const login = (credentials) =>
  API.post('/auth/login/', credentials).then((res) => res.data);
export const register = (credentials) =>
  API.post('/auth/register/', credentials).then((res) => res.data);
export const getProfile = () =>
  API.get('/auth/profile/').then((res) => res.data);