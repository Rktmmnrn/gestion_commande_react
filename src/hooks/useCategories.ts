import { useQuery } from '@tanstack/react-query';
import { getCategoriesAsync } from '@/api/categories';

export const useCategories = () => {
  
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesAsync,
    staleTime: 5 * 60 * 1000,
  });
};
