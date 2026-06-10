import apiClient from './client';
import type { Client } from '@/types';

export const getClientsAsync = async (): Promise<Client[]> => {
  const { data } = await apiClient.get<Client[]>('clients/');
  return data;
};
