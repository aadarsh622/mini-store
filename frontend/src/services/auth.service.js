import { api } from './api.js';

export const authService = {
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),

  login: (email, password) => api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getMe: async () => {
    const response = await api.get('/users/me');
    return {
      ...response,
      data: { user: response.data?.user ?? response.data },
    };
  },

  updateProfile: (data) => api.put('/users/me', data),

  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  validateResetToken: (token) => api.get(`/auth/reset-password/${token}`),
};
