import apiClient from './client';
import type { Reservation } from '@/types';

export const createReservationAsync = async (data: {
  date_heure: string;
  nb_personnes: number;
  type_commande: 'on_site' | 'online' | 'take_away';
  client: number;
  table?: number;
}): Promise<Reservation> => {
  const { data: response } = await apiClient.post<Reservation>('reservations/', data);
  return response;
};

export const getReservationsAsync = async (): Promise<Reservation[]> => {
  const { data } = await apiClient.get<Reservation[]>('reservations/');
  return data;
};
