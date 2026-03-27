import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getOrdersAsync,
  createOrderAsync,
  updateOrderStatusAsync,
  addOrderItemAsync,
} from '@/api/orders';
import type {
  Order,
  CreateOrderPayload,
  AddOrderItemPayload,
  OrderFilters,
} from '@/types';

export const useOrders = (filters?: OrderFilters) => {
  return useQuery<Order[], Error>({
    queryKey: ['orders', filters],
    queryFn: () => getOrdersAsync(filters),
    refetchInterval: 2000, // Auto-refetch every 2 seconds
    staleTime: 500, // Very short stale time for real-time updates
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderAsync(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      updateOrderStatusAsync(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useAddOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: AddOrderItemPayload;
    }) => addOrderItemAsync(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
