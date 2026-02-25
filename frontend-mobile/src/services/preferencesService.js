import { api } from './apiClient';

export const prefsService = {
    fetchQuestions: () => api.get('/preferences/questions/'),
    startSession: (skip = false) => api.post('/preferences/start/', { skip }),
    submitAnswer: (question_id, answer_id, session_id) =>
        api.post('/preferences/answer/', { question_id, answer_id, session_id }),
    finishSession: (session_id) => api.post('/preferences/finish/', { session_id }),
    fetchMyPreferences: () => api.get('/preferences/me/'),
};
