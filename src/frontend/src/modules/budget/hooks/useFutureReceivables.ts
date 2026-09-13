import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateFutureReceivableInput,
  RescheduleFutureReceivableInput,
} from '@saldix/shared-types';
import {
  confirmFutureReceivable,
  createFutureReceivable,
  fetchFutureReceivables,
  rescheduleFutureReceivable,
} from '../api/future-receivables';

export function useFutureReceivables(month: string) {
  return useQuery({
    queryKey: ['future-receivables', month],
    queryFn: () => fetchFutureReceivables(month),
  });
}

function useInvalidateReceivables(month: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['future-receivables', month] });
    queryClient.invalidateQueries({ queryKey: ['incomes'] });
  };
}

export function useCreateFutureReceivable(month: string) {
  const invalidate = useInvalidateReceivables(month);
  return useMutation({
    mutationFn: (input: CreateFutureReceivableInput) => createFutureReceivable(input),
    onSuccess: invalidate,
  });
}

export function useConfirmFutureReceivable(month: string) {
  const invalidate = useInvalidateReceivables(month);
  return useMutation({
    mutationFn: (id: string) => confirmFutureReceivable(id),
    onSuccess: invalidate,
  });
}

export function useRescheduleFutureReceivable(month: string) {
  const invalidate = useInvalidateReceivables(month);
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RescheduleFutureReceivableInput }) =>
      rescheduleFutureReceivable(id, input),
    onSuccess: invalidate,
  });
}
