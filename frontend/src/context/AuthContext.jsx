import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { setAuthHandlers } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
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
    setUser({ token: storedToken });
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token: authToken, user: authUser } = response.data;

    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(authUser);

    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const { token: authToken, user: authUser } = response.data;

    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(authUser);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setToken('');
    setUser(null);
  };

  useEffect(() => {
    setAuthHandlers({
      logout,
      redirect: (path) => navigate(path, { replace: true }),
    });
  }, [navigate]);

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
