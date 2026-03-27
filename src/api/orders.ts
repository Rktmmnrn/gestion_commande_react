import apiClient from './client';
import type {
  Order,
  CreateOrderPayload,
  AddOrderItemPayload,
  OrderFilters,
} from '@/types';

export const getOrdersAsync = async (filters?: OrderFilters): Promise<Order[]> => {
  const params: Record<string, string | number> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.table_number) params.table_number = filters.table_number;
  const { data } = await apiClient.get<Order[]>('orders/', { params });
  return data;
};

export const createOrderAsync = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const { data } = await apiClient.post<Order>('orders/', payload);
  return data;
};

export const updateOrderStatusAsync = async (
  id: number,
  status: string
): Promise<Order> => {
  const { data } = await apiClient.patch<Order>(`orders/${id}/status/`, {
    status,
  });
  return data;
};

export const addOrderItemAsync = async (
  orderId: number,
  payload: AddOrderItemPayload
): Promise<Order> => {
  const { data } = await apiClient.post<Order>(
    `orders/${orderId}/add_item/`,
    payload
  );
  return data;
};
