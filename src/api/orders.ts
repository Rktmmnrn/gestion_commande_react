import apiClient from './client';
import type { Order, CreateOrderPayload } from '@/types';

interface OrderFilters {
  status?: string;
  table?: number;
}

export const getOrdersAsync = async (filters?: OrderFilters): Promise<Order[]> => {
  const params: Record<string, string | number> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.table) params.table = filters.table;
  const { data } = await apiClient.get<Order[]>('orders/', { params });
  return data;
};

export const createOrderAsync = async (payload: CreateOrderPayload): Promise<Order> => {
  const { data } = await apiClient.post<Order>('orders/', payload);
  return data;
};

export const updateOrderStatusAsync = async (id: number, status: string): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`orders/${id}/status/`, { status });
  return data;
};
