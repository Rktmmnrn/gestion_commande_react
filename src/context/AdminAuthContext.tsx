import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import apiClient from '@/api/client';

interface AdminAuthContextType {
  isAdmin: boolean;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Vérifie si un token JWT est encore valide
function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
}

function getStoredToken(): string | null {
  const token = localStorage.getItem('admin_token');
  if (!token) return null;
  if (!isTokenValid(token)) {
    localStorage.removeItem('admin_token');
    return null;
  }
  return token;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => getStoredToken()
  );

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await apiClient.post('token/', {
      username,
      password,
    });
    localStorage.setItem('admin_token', data.access);
    setAccessToken(data.access);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setAccessToken(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{
      isAdmin: !!accessToken,
      accessToken,
      login,
      logout,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}