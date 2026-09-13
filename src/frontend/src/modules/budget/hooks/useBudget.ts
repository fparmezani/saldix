import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UpdateBudgetSettingsInput } from '@saldix/shared-types';
import { fetchBudgetSettings, fetchBudgetSummary, updateBudgetSettings } from '../api/budget';

export function useBudgetSettings(month: string) {
  return useQuery({
    queryKey: ['budget-settings', month],
    queryFn: () => fetchBudgetSettings(month),
  });
}

export function useBudgetSummary(month: string) {
  return useQuery({
    queryKey: ['budget-summary', month],
    queryFn: () => fetchBudgetSummary(month),
  });
}

export function useUpdateBudgetSettings(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBudgetSettingsInput) => updateBudgetSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-settings', month] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary', month] });
    },
  });
}
