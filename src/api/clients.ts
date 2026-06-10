import apiClient from './client';
import type { Client } from '@/types';

export const getClientsAsync = async (): Promise<Client[]> => {
  const { data } = await apiClient.get<Client[]>('clients/');
  return data;
};

export const createClientAsync = async (data: {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}): Promise<Client> => {
  const { data: response } = await apiClient.post<Client>('clients/', data);
  return response;
};
