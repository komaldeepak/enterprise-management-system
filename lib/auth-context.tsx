'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthToken, validateToken, getStoredAuth, setStoredAuth, clearStoredAuth } from './auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore auth from localStorage
    const stored = getStoredAuth();
    if (stored) {
      const validated = validateToken(stored.token);
      if (validated) {
        setUser(validated);
        setToken(stored.token);
      } else {
        clearStoredAuth();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
    setStoredAuth({ user: newUser, token: newToken });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearStoredAuth();
  };

  const hasPermission = (role: string): boolean => {
    if (!user) return false;
    const roleHierarchy = { admin: 3, manager: 2, user: 1 };
    return (
      roleHierarchy[user.role as keyof typeof roleHierarchy] >=
      roleHierarchy[role as keyof typeof roleHierarchy]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
