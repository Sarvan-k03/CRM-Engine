import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { setAuthHandlers } from '../services/api';

const AuthContext = createContext(null);

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
    setUser({ token: storedToken }); // Optional: In the future, you might want to fetch the real user profile here
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token: authToken, user: authUser } = response.data;

    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(authUser);
    API.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    return response.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const { token: authToken, user: authUser } = response.data;

    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(authUser);
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