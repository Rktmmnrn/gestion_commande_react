import { useQuery } from '@tanstack/react-query';
import { getProductsAsync } from '@/api/products';

export const useProducts = (filters?: { category?: number; available?: boolean }) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProductsAsync(filters),
    staleTime: 30 * 1000,
  });
