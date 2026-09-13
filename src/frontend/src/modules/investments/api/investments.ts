import type {
  CreateInvestmentInput,
  InvestmentsSummary,
  InvestmentWithGain,
  UpdateInvestmentInput,
} from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchInvestments() {
  return apiFetch<InvestmentWithGain[]>('/investments');
}

export function fetchInvestmentsSummary() {
  return apiFetch<InvestmentsSummary>('/investments/summary');
}

export function createInvestment(input: CreateInvestmentInput) {
  return apiFetch<InvestmentWithGain>('/investments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateInvestment(id: string, input: UpdateInvestmentInput) {
  return apiFetch<InvestmentWithGain>(`/investments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteInvestment(id: string) {
  return apiFetch<void>(`/investments/${id}`, { method: 'DELETE' });
}
