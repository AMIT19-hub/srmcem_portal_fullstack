import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AUTH_EXPIRED_EVENT } from '../api/axios';
import { clearAuthStorage, loginUser, registerUser } from '../services/authService';
import { getMyProfileImage } from '../services/profileService';
import { displayNameFromEmail, getJwtPayload, getRoleFromToken, ROLE_KEY, TOKEN_KEY, USER_KEY } from '../utils/auth';

const AuthContext = createContext(null);
const validRoles = new Set(['STUDENT', 'RECRUITER', 'ADMIN']);

const readStoredUser = () => {
  try {
    const value = localStorage.getItem(USER_KEY);
    const user = value ? JSON.parse(value) : null;
    const role = localStorage.getItem(ROLE_KEY);
    return user && role ? { ...user, name: user.name || displayNameFromEmail(user.email), role } : null;
  } catch {
    clearAuthStorage();
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(readStoredUser);
  const [profileImage, setProfileImage] = useState({ identity: '', url: '', loading: false });
  const requestRef = useRef(null);
  const requestGenerationRef = useRef(0);
  const imageIdentity = token && user ? `${user.role}:${user.email || ''}:${token}` : '';
  const imageIdentityRef = useRef(imageIdentity);

  const refreshProfileImage = useCallback((force = false) => {
    const identity = token && user && ['STUDENT', 'RECRUITER'].includes(user.role)
      ? `${user.role}:${user.email || ''}:${token}`
      : '';
    if (!identity) return Promise.resolve(false);
    if (!force && requestRef.current?.identity === identity) return requestRef.current.promise;

    const generation = ++requestGenerationRef.current;
    setProfileImage((current) => ({
      identity,
      url: current.identity === identity ? current.url : '',
      loading: true,
    }));

    const promise = (async () => {
      try {
        const { data, headers, status } = await getMyProfileImage();
        const contentType = headers?.['content-type'] || data?.type || '';
        if (!contentType.toLowerCase().startsWith('image/')) {
          throw new Error(`Expected an image response, received ${contentType || 'unknown content type'}`);
        }
        const url = URL.createObjectURL(data);
        if (generation !== requestGenerationRef.current || imageIdentityRef.current !== identity) {
          URL.revokeObjectURL(url);
          return false;
        }
        if (import.meta.env.DEV) console.debug('[profile-image] authenticated image request succeeded', { status, contentType, finalSrc: url });
        setProfileImage({ identity, url, loading: false });
        return true;
      } catch (error) {
        const status = error?.response?.status || null;
        const contentType = error?.response?.headers?.['content-type'] || null;
        if (generation !== requestGenerationRef.current || imageIdentityRef.current !== identity) return false;
        if (import.meta.env.DEV) console.debug('[profile-image] authenticated image request failed', { status, contentType });
        setProfileImage((current) => status === 404
          ? { identity, url: '', loading: false }
          : { identity, url: current.identity === identity ? current.url : '', loading: false });
        return false;
      } finally {
        if (requestRef.current?.generation === generation) requestRef.current = null;
      }
    })();
    requestRef.current = { identity, generation, promise };
    return promise;
  }, [token, user]);

  useEffect(() => {
    const clearSession = () => {
      imageIdentityRef.current = '';
      requestGenerationRef.current += 1;
      requestRef.current = null;
      setToken('');
      setUser(null);
      setProfileImage({ identity: '', url: '', loading: false });
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, clearSession);
  }, []);

  useEffect(() => {
    imageIdentityRef.current = imageIdentity;
    if (imageIdentity && ['STUDENT', 'RECRUITER'].includes(user?.role)) {
      void refreshProfileImage();
    }
  }, [imageIdentity, refreshProfileImage, user?.role]);

  useEffect(() => {
    const url = profileImage.url;
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [profileImage.url]);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const token = typeof response.data === 'string'
      ? response.data.trim()
      : response.data?.token || response.data?.jwt || response.data?.accessToken;

    if (!token) {
      throw new Error('The server response did not include a JWT token.');
    }

    const claims = getJwtPayload(token);
    const role = String(response.data?.role || response.data?.user?.role || getRoleFromToken(token)).replace(/^ROLE_/, '').toUpperCase();
    if (!validRoles.has(role)) {
      throw new Error('JWT does not contain a valid user role.');
    }

    const nextUser = {
      id: claims.id ?? claims.userId ?? null,
      name: claims.name || claims.fullName || displayNameFromEmail(claims.email || claims.sub || credentials.email),
      email: claims.email || claims.sub || credentials.email,
      role,
    };

    imageIdentityRef.current = `${role}:${nextUser.email || ''}:${token}`;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(token);
    setUser(nextUser);
    return nextUser;
  };

  const register = (payload) => registerUser(payload);
  const logout = () => {
    clearAuthStorage();
    imageIdentityRef.current = '';
    requestGenerationRef.current += 1;
    requestRef.current = null;
    setToken('');
    setUser(null);
    setProfileImage({ identity: '', url: '', loading: false });
  };

  const profileImageUrl = profileImage.identity === imageIdentity ? profileImage.url : '';
  const profileImageLoading = Boolean(imageIdentity && ['STUDENT', 'RECRUITER'].includes(user?.role)
    && (profileImage.identity !== imageIdentity || profileImage.loading));
  const value = useMemo(() => ({
    token,
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    profileImageUrl,
    profileImageLoading,
    refreshProfileImage,
    login,
    register,
    logout,
  }), [token, user, profileImageUrl, profileImageLoading, refreshProfileImage]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
