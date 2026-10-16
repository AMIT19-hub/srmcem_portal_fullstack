export const TOKEN_KEY = 'token';
export const ROLE_KEY = 'role';
export const USER_KEY = 'srmcem_user';

export const normalizeRole = (role) => String(role || '').replace(/^ROLE_/, '').toUpperCase();

export const displayNameFromEmail = (email) => String(email || '')
  .split('@')[0]
  .replace(/[._-]+/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const getToken = () => localStorage.getItem(TOKEN_KEY);

const roleValue = (value) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  return typeof candidate === 'object' && candidate !== null
    ? candidate.authority || candidate.role
    : candidate;
};

export const getJwtPayload = (token) => {
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return {};

    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return {};
  }
};

export const getRoleFromToken = (token) => {
  const payload = getJwtPayload(token);
  return normalizeRole(roleValue(payload.role || payload.roles || payload.authorities));
};

export const isAuthenticated = () => Boolean(getToken());

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('srmcem_token');
};

export const clearAuthStorage = clearAuth;

export const dashboardPathFor = (role) => ({
  STUDENT: '/student',
  RECRUITER: '/recruiter',
  ADMIN: '/admin',
}[normalizeRole(role)] || '/');
