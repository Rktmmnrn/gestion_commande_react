import apiClient from './client';
import type { Table } from '@/types';

export const getTablesAsync = async (): Promise<Table[]> => {
  const { data } = await apiClient.get<Table[]>('tables/');
  return data;
};
