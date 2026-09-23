'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginApi } from '../service/auth.api';
import {
  saveAuth,
  clearAuth,
  getToken,
  getUser,
} from '@/shared/utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();

    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsInitializing(false);
  }, []);

  
  async function login({ username, password }) {
    if (isLoggingIn) return null; // double-submit guard

    setIsLoggingIn(true);
    try {
      const data = await loginApi({ username, password });

      const authUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      };

      saveAuth(data.accessToken, authUser);
      setUser(authUser);

      return authUser;
    } finally {
      setIsLoggingIn(false);
    }
  }



function logout() {
    clearAuth();
    setUser(null);
    router.replace('/login');
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isInitializing,
    isLoggingIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}