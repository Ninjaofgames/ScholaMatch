import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/preferences';
const USER_TOKEN_KEY = 'scholamatch_user_token';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchQuestions = async () => {
  const res = await api.get('/questions/');
  return res.data;
};

export const startSession = async (skip = false) => {
  const res = await api.post('/start/', { skip });
  return res.data;
};

export const submitAnswer = async (question_id, answer_id, session_id) => {
  const res = await api.post('/answer/', { question_id, answer_id, session_id });
  return res.data;
};

export const finishSession = async (session_id) => {
  const res = await api.post('/finish/', { session_id });
  return res.data;
};

export const fetchMyPreferences = async () => {
  const res = await api.get('/me/');
  return res.data;
};

export const updateAnswer = async (session_id, question_id, answer_id) => {
  const res = await api.patch('/update/', { session_id, question_id, answer_id });
  return res.data;
};

