import { useQuery } from '@tanstack/react-query';
import { getProductsAsync } from '@/api/products';
import type { Product, ProductFilters } from '@/types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery<Product[], Error>({
    queryKey: ['products', filters],
    queryFn: () => getProductsAsync(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
