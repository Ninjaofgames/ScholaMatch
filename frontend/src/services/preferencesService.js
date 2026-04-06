import apiClient from '../api/apiClient';

export { apiClient };
const API_PATH = '/preferences';

export const fetchQuestions = async () => {
  const response = await apiClient.get(`${API_PATH}/questions/`);
  return response.data;
};

export const startSession = async (skip = false) => {
  const response = await apiClient.post(`${API_PATH}/start/`, { skip });
  return response.data;
};

export const submitAnswer = async (questionId, answerId, sessionId) => {
  const response = await apiClient.post(`${API_PATH}/answer/`, {
    question_id: questionId,
    answer_id: answerId,
    session_id: sessionId,
  });
  return response.data;
};

export const finishSession = async (sessionId) => {
  const response = await apiClient.post(`${API_PATH}/finish/`, { session_id: sessionId });
  return response.data;
};

export const fetchMyPreferences = async () => {
  const response = await apiClient.get(`${API_PATH}/me/`);
  return response.data;
};

export const updateAnswer = async (sessionId, questionId, answerId) => {
  const response = await apiClient.patch(`${API_PATH}/update/`, {
    session_id: sessionId,
    question_id: questionId,
    answer_id: answerId,
  });
  return response.data;
};
