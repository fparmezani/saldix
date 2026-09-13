import type {
  CreateIncomeScheduleInput,
  IncomeSchedule,
  UpdateIncomeScheduleInput,
} from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchIncomeSchedules() {
  return apiFetch<IncomeSchedule[]>('/income-schedules');
}

export function createIncomeSchedule(input: CreateIncomeScheduleInput) {
  return apiFetch<IncomeSchedule>('/income-schedules', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateIncomeSchedule(id: string, input: UpdateIncomeScheduleInput) {
  return apiFetch<IncomeSchedule>(`/income-schedules/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
