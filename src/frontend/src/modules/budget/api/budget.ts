import type { BudgetSettings, BudgetSummary, UpdateBudgetSettingsInput } from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchBudgetSettings(month: string) {
  return apiFetch<BudgetSettings>(`/budget/settings?month=${month}`);
}

export function updateBudgetSettings(input: UpdateBudgetSettingsInput) {
  return apiFetch<BudgetSettings>('/budget/settings', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function fetchBudgetSummary(month: string) {
  return apiFetch<BudgetSummary>(`/budget/summary?month=${month}`);
}
