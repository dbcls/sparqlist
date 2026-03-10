import React, { createContext, useContext, useEffect, useState } from 'react';

import { login as requestLogin } from './lib/api';

const STORAGE_KEY = 'sparqlist.accessToken';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  const value = {
    token,
    isAuthenticated: Boolean(token),
    async login(password) {
      const nextToken = await requestLogin(password);
      setToken(nextToken);
      return nextToken;
    },
    logout() {
      setToken(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
