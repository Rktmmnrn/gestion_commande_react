import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import apiClient from '@/api/client';

interface AdminAuthContextType {
  isAdmin: boolean;
  accessToken: string | null;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('admin_token')
  );

  const login = useCallback(async (password: string) => {
    const { data } = await apiClient.post('token/', {
      username: 'admin',
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