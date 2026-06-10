import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservationAsync } from '@/api/reservations';

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReservationAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};
