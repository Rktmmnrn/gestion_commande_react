import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientsAsync, createClientAsync } from '@/api/clients';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClientsAsync,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClientAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};
