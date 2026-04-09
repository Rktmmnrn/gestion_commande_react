import { useQuery } from '@tanstack/react-query';
import { getProductsAsync } from '@/api/products';

export const useProducts = (filters?: { category?: number; available?: boolean }) => {
  const hasToken = !!localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProductsAsync(filters),
    enabled: hasToken,
    staleTime: 30 * 1000,
  });
};
