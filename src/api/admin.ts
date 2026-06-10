import apiClient from './client';
import type { Category, Product, Order, OrderStatus, Table } from '@/types';

// ============= Categories =============
export const createCategoryAsync = async (data: { name: string }): Promise<Category> =>
  (await apiClient.post<Category>('categories/', data)).data;

export const updateCategoryAsync = async (id: number, data: { name: string }): Promise<Category> =>
  (await apiClient.put<Category>(`categories/${id}/`, data)).data;

export const deleteCategoryAsync = async (id: number): Promise<void> => {
  await apiClient.delete(`categories/${id}/`);
};

// ============= Products =============
export const createProductAsync = async (data: {
  name: string;
  price: string;
  category: number;
  available: boolean;
}): Promise<Product> => (await apiClient.post<Product>('products/', data)).data;

export const updateProductAsync = async (
  id: number,
  data: {
    name: string;
    price: string;
    category: number;
    available: boolean;
  }
): Promise<Product> => (await apiClient.put<Product>(`products/${id}/`, data)).data;

export const patchProductAvailabilityAsync = async (id: number, available: boolean): Promise<Product> =>
  (await apiClient.patch<Product>(`products/${id}/`, { available })).data;

export const deleteProductAsync = async (id: number): Promise<void> => {
  await apiClient.delete(`products/${id}/`);
};

// ============= Orders =============
export const updateOrderStatusAsync = async (id: number, status: OrderStatus): Promise<Order> =>
  (await apiClient.patch<Order>(`orders/${id}/status/`, { status })).data;

export const deleteOrderAsync = async (id: number): Promise<void> => {
  await apiClient.delete(`orders/${id}/`);
};

// ============= Tables =============
export const createTableAsync = async (data: {
  number: number;
  capacity: number;
  status: 'free' | 'occuped';
}): Promise<Table> => (await apiClient.post<Table>('tables/', data)).data;

export const updateTableAsync = async (
  id: number,
  data: {
    number: number;
    capacity: number;
    status: 'free' | 'occuped';
  }
): Promise<Table> => (await apiClient.put<Table>(`tables/${id}/`, data)).data;

export const deleteTableAsync = async (id: number): Promise<void> => {
  await apiClient.delete(`tables/${id}/`);
};
