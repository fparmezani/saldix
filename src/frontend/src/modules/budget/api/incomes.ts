import type { CreateIncomeInput, Income } from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export interface IncomeBreakdown {
  incomes: Income[];
  totalAmount: number;
  percentageByType: Record<string, number>;
}

export function fetchIncomes(month: string) {
  return apiFetch<IncomeBreakdown>(`/incomes?month=${month}`);
}

export function createIncome(input: CreateIncomeInput) {
  return apiFetch<Income>('/incomes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteIncome(id: string) {
  return apiFetch<void>(`/incomes/${id}`, { method: 'DELETE' });
}
