import type {
  CreateFutureReceivableInput,
  FutureReceivable,
  RescheduleFutureReceivableInput,
} from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchFutureReceivables(month: string) {
  return apiFetch<FutureReceivable[]>(`/future-receivables?month=${month}`);
}

export function createFutureReceivable(input: CreateFutureReceivableInput) {
  return apiFetch<FutureReceivable>('/future-receivables', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function confirmFutureReceivable(id: string) {
  return apiFetch<FutureReceivable>(`/future-receivables/${id}/confirm`, {
    method: 'PATCH',
  });
}

export function rescheduleFutureReceivable(id: string, input: RescheduleFutureReceivableInput) {
  return apiFetch<FutureReceivable>(`/future-receivables/${id}/reschedule`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
