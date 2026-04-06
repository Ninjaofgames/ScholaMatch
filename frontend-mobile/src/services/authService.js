import { api } from './apiClient';

export const authService = {
    register: (data) => api.post('/auth/register/', data),
    verifyEmail: (email, code) => api.post('/auth/verify-email/', { email, code }),
    resendCode: (email) => api.post('/auth/resend-code/', { email }),
    login: (email, password) => api.post('/auth/login/', { email, password }),
    getProfile: () => api.get('/auth/profile/'),
    updateProfile: (form) => api.patchForm('/auth/update-profile/', form),
    changePassword: (data) => api.post('/auth/change-password/', data),
    passwordResetRequest: (email) => api.post('/auth/password-reset/request/', { email }),
    passwordResetConfirm: (data) => api.post('/auth/password-reset/confirm/', data),
};
