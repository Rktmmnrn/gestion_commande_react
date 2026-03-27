import apiClient from './client';
import type { Category } from '@/types';

export const getCategoriesAsync = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('categories/');
  return data;
};
