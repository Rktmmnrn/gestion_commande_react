import { createContext, useState, useEffect, ReactNode } from 'react';
import type { AuthUser, LoginPayload, AuthTokens } from '@/types';
import { loginAsync, decodeToken, refreshTokenAsync } from '@/api/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  accessToken: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    if (storedAccessToken) {
      try {
        const decodedUser = decodeToken(storedAccessToken);
        setAccessToken(storedAccessToken);
        setUser(decodedUser);
      } catch (error) {
        console.error('Failed to decode stored token:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }, []);

  const login = async (payload: LoginPayload) => {
    const tokens = await loginAsync(payload);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    const decodedUser = decodeToken(tokens.access);
    setAccessToken(tokens.access);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user ? user.is_staff || user.is_superuser : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
