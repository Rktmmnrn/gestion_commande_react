import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTablesAsync } from '@/api/tables';
import { createTableAsync, updateTableAsync, deleteTableAsync } from '@/api/admin';

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: getTablesAsync,
    staleTime: 30 * 1000,
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTableAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { number: number; capacity: number; status: 'free' | 'occuped' } }) =>
      updateTableAsync(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTableAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};
