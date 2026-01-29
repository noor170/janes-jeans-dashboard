import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, LoginRequest } from '@/types/auth';
import { authApi } from '@/lib/authApi';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      const storedUser = authApi.getStoredUser();
      if (storedUser) {
        const isValid = await authApi.validateToken();
        if (isValid) {
          setUser(storedUser);
        } else {
          // Try to refresh the token
          try {
            const refreshed = await authApi.refreshToken();
            setUser(refreshed.user);
          } catch {
            authApi.logout();
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.adminLogin(credentials);
    setUser(response.user);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const refreshAuth = async () => {
    try {
      const response = await authApi.refreshToken();
      setUser(response.user);
    } catch {
      logout();
      throw new Error('Session expired');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
