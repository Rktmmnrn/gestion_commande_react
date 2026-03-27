import apiClient from './client';
import type { Product } from '@/types';

interface ProductFilters {
  category?: number;
  available?: boolean;
}

export const getProductsAsync = async (filters?: ProductFilters): Promise<Product[]> => {
  const params: Record<string, string | number | boolean> = {};
  if (filters?.category) params.category = filters.category;
  if (filters?.available !== undefined) params.available = filters.available;
  const { data } = await apiClient.get<Product[]>('products/', { params });
  return data;
};

export const patchProductAvailabilityAsync = async (id: number, available: boolean): Promise<Product> => {
  const { data } = await apiClient.patch<Product>(`products/${id}/`, { available });
  return data;
};
