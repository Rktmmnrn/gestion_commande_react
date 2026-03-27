import { useQuery } from '@tanstack/react-query';
import { getCategoriesAsync } from '@/api/categories';
import type { Category } from '@/types';

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategoriesAsync,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};
