import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { setAuthHandlers } from '../services/api';

const AuthContext = createContext(null);

// Helper function to decode JWT payload safely
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setToken('');
      setUser(null);
      API.defaults.headers.common['Authorization'] = '';
      setLoading(false);
      return;
    }

    setToken(storedToken);
    API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    
    // FIXED: Decode token to extract { id, role } instead of hardcoding { token: storedToken }
    const decodedUser = parseJwt(storedToken);
    setUser(decodedUser || { token: storedToken });

    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token: authToken, user: authUser } = response.data;

    localStorage.setItem('token', authToken);
    setToken(authToken);

    // If login response doesn't include user object, decode from JWT token
    const decodedUser = authUser || parseJwt(authToken);
    setUser(decodedUser);

    API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    return response.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const { token: authToken, user: authUser } = response.data;

    localStorage.setItem('token', authToken);
    setToken(authToken);

    const decodedUser = authUser || parseJwt(authToken);
    setUser(decodedUser);

    API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  }, []);

  useEffect(() => {
    setAuthHandlers({
      logout,
      redirect: (path) => navigate(path, { replace: true }),
    });
  }, [navigate, logout]);

  const value = useMemo(
    () => ({ user, token, isLoading: loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{loading ? null : children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}