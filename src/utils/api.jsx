import axios from 'axios';

// With Vite proxy, we can just use /api
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  sendEmailOTP: (email) => api.post('/auth/send-email-otp', { email }),
  sendPhoneOTP: (phone) => api.post('/auth/send-phone-otp', { phone }),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  getCurrentUser: () => api.get('/auth/current-user'),
  getAllUsers: () => api.get('/auth/users'),
  updateProfile: (data) => api.put('/auth/profile', data),
  sendConnectionRequest: (userId) => api.post(`/auth/connect/${userId}`),
  acceptConnectionRequest: (userId) => api.post(`/auth/accept/${userId}`),
  rejectConnectionRequest: (userId) => api.post(`/auth/reject/${userId}`),
  getConnections: () => api.get('/auth/connections'),
};

export const walletAPI = {
  getWalletInfo: () => api.get('/wallet/info'),
  createOrder: (amount) => api.post('/wallet/order', { amount }),
  verifyPayment: (data) => api.post('/wallet/verify', data),
};

export default api;
