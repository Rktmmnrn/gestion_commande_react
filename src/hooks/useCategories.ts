import { useQuery } from '@tanstack/react-query';
import { getCategoriesAsync } from '@/api/categories';

export const useCategories = () => {
  const hasToken = !!localStorage.getItem('access_token');
  
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAsync,
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
  });
};
