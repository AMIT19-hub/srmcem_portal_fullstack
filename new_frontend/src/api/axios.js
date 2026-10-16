import axios from 'axios';
import { clearAuthStorage } from '../utils/auth';
import { errorText } from '../utils/data';

export const AUTH_EXPIRED_EVENT = 'srmcem-auth-expired';
export const AUTH_FORBIDDEN_EVENT = 'srmcem-auth-forbidden';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080' });

api.interceptors.request.use((config) => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((response) => response, (error) => {
  error.message = errorText(error, 'Unable to complete the request. Please try again.');
  if (error.response?.status === 401) { sessionStorage.setItem('srmcem-auth-notice', 'Your session has expired. Please sign in again.'); clearAuthStorage(); window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT)); if (window.location.pathname !== '/login') window.location.assign('/login'); }
  if (error.response?.status === 403) { window.dispatchEvent(new Event(AUTH_FORBIDDEN_EVENT)); if (window.location.pathname !== '/unauthorized') window.location.assign('/unauthorized'); }
  return Promise.reject(error);
});
export default api;
