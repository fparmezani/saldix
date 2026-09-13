import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateIncomeInput } from '@saldix/shared-types';
import { createIncome, deleteIncome, fetchIncomes } from '../api/incomes';

export function useIncomes(month: string) {
  return useQuery({
    queryKey: ['incomes', month],
    queryFn: () => fetchIncomes(month),
  });
}

export function useCreateIncome(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateIncomeInput) => createIncome(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes', month] });
    },
  });
}

export function useDeleteIncome(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes', month] });
    },
  });
}
