import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateVariableExpenseInput } from '@saldix/shared-types';
import {
  createVariableExpense,
  deleteVariableExpense,
  fetchVariableExpenses,
} from '../api/variable-expenses';

export function useVariableExpenses(month: string, categoryId?: string) {
  return useQuery({
    queryKey: ['variable-expenses', month, categoryId ?? null],
    queryFn: () => fetchVariableExpenses(month, categoryId),
  });
}

export function useCreateVariableExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVariableExpenseInput) => createVariableExpense(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variable-expenses', month] });
    },
  });
}

export function useDeleteVariableExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVariableExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variable-expenses', month] });
    },
  });
}
