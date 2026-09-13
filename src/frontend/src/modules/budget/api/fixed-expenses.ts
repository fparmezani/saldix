import type { CreateFixedExpenseInput, FixedExpense } from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchFixedExpenses(month: string) {
  return apiFetch<FixedExpense[]>(`/expenses/fixed?month=${month}`);
}

export function createFixedExpense(input: CreateFixedExpenseInput) {
  return apiFetch<FixedExpense>('/expenses/fixed', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteFixedExpense(id: string) {
  return apiFetch<void>(`/expenses/fixed/${id}`, { method: 'DELETE' });
}
