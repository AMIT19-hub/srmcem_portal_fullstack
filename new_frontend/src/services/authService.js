import api from '../api/axios';
import { clearAuthStorage } from '../utils/auth';
export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const verifyOtp = (payload) => api.post('/auth/verify-otp', payload);
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => api.post('/auth/reset-password', payload);
export const logoutUser = () => clearAuthStorage();
export { clearAuthStorage };
