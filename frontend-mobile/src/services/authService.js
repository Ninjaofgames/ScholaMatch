import { api } from './apiClient';

export const authService = {
    register: (data) => api.post('/register/', data),
    verifyEmail: (email, code) => api.post('/verify-email/', { email, code }),
    resendCode: (email) => api.post('/resend-code/', { email }),
    login: (email, password) => api.post('/user/login/', { email, password }),
    getProfile: () => api.get('/user/profile/'),
    updateProfile: (form) => api.patchForm('/user/profile/update/', form),
    changePassword: (data) => api.post('/user/change-password/', data),
    passwordResetRequest: (email) => api.post('/password-reset/request/', { email }),
    passwordResetConfirm: (data) => api.post('/password-reset/confirm/', data),
};
