import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReservationsAsync,
  createReservationAsync,
  updateReservationAsync,
  deleteReservationAsync
} from '@/api/reservations';

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: getReservationsAsync,
    staleTime: 30 * 1000,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReservationAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReservationAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReservationAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

