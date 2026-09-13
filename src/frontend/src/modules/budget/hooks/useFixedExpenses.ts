import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateFixedExpenseInput } from '@saldix/shared-types';
import { createFixedExpense, deleteFixedExpense, fetchFixedExpenses } from '../api/fixed-expenses';

export function useFixedExpenses(month: string) {
  return useQuery({
    queryKey: ['fixed-expenses', month],
    queryFn: () => fetchFixedExpenses(month),
  });
}

export function useCreateFixedExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFixedExpenseInput) => createFixedExpense(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses', month] });
    },
  });
}

export function useDeleteFixedExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFixedExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses', month] });
    },
  });
}
