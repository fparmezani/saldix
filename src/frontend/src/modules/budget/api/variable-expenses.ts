import type { CreateVariableExpenseInput, VariableExpense } from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchVariableExpenses(month: string, categoryId?: string) {
  const query = categoryId ? `?month=${month}&categoryId=${categoryId}` : `?month=${month}`;
  return apiFetch<VariableExpense[]>(`/expenses/variable${query}`);
}

export function createVariableExpense(input: CreateVariableExpenseInput) {
  return apiFetch<VariableExpense | VariableExpense[]>('/expenses/variable', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteVariableExpense(id: string) {
  return apiFetch<void>(`/expenses/variable/${id}`, { method: 'DELETE' });
}
