import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { AuthUser, LoginPayload } from '@/types';
import { loginAsync, decodeToken, refreshTokenAsync } from '@/api/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validateAndSetUser = useCallback((token: string): AuthUser | null => {
    try {
      const decodedUser = decodeToken(token);
      
      if (!decodedUser.username || typeof decodedUser.id !== 'number') {
        throw new Error('Invalid token structure');
      }
      
      return decodedUser;
    } catch (err) {
      console.error('Token validation failed:', err);
      return null;
    }
  }, []);

  const rehydrateUser = useCallback(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    
    if (storedAccessToken) {
      const validUser = validateAndSetUser(storedAccessToken);
      if (validUser) {
        setUser(validUser);
        setError(null);
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setIsLoading(false);
  }, [validateAndSetUser]);

  useEffect(() => {
    rehydrateUser();
  }, [rehydrateUser]);

  // Sync between tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        if (e.newValue) {
          const validUser = validateAndSetUser(e.newValue);
          if (validUser) {
            setUser(validUser);
          }
        } else {
          setUser(null);
        }
      }
    };

    const handleAuthLogout = () => {
      setUser(null);
      setError(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [validateAndSetUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const tokens = await loginAsync(payload);
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      
      const decodedUser = decodeToken(tokens.access);
      setUser(decodedUser);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message ||
                          'Identifiants invalides. Veuillez réessayer.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setError(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      logout();
      return;
    }

    try {
      const { access } = await refreshTokenAsync(refresh);
      localStorage.setItem('access_token', access);
      const decodedUser = decodeToken(access);
      setUser(decodedUser);
    } catch (err) {
      console.error('Token refresh failed:', err);
      logout();
    }
  }, [logout]);

  const isAuthenticated = !!user;
  const isAdmin = user ? user.is_staff || user.is_superuser : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        error,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};