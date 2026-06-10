import { useQuery } from '@tanstack/react-query';
import { getClientsAsync } from '@/api/clients';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClientsAsync,
    staleTime: 5 * 60 * 1000,
  });
};
