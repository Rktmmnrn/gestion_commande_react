import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrdersAsync, createOrderAsync, updateOrderStatusAsync, addOrderItemAsync } from '@/api/orders';
import type { CreateOrderPayload, AddItemPayload } from '@/types';

export const useOrders = (filters?: { status?: string; table_number?: number }) =>
  useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrdersAsync(filters),
    refetchInterval: 30000,
    staleTime: 15000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderAsync(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateOrderStatusAsync(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useAddOrderItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: number; payload: AddItemPayload }) => addOrderItemAsync(orderId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};
