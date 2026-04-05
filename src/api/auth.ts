import apiClient from './client';
import type { AuthTokens, AuthUser, LoginPayload } from '@/types';

export const loginAsync = async (payload: LoginPayload): Promise<AuthTokens> => {
  const { data } = await apiClient.post<AuthTokens>('token/', payload);
  return data;
};

/**
 * Décode le JWT (sans librairie) pour extraire les infos user
 */
export const decodeToken = (token: string): AuthUser => {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(atob(base64));
  return {
    id: payload.user_id,
    username: payload.username ?? '',
    is_staff: payload.is_staff ?? false,
    is_superuser: payload.is_superuser ?? false,
  };
};

export const refreshTokenAsync = async (refresh: string): Promise<{ access: string }> => {
  const { data } = await apiClient.post<{ access: string }>('token/refresh/', { refresh });
  return data;
};
