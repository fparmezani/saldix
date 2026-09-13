import type { OverviewPoint } from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchOverview(months: number) {
  return apiFetch<OverviewPoint[]>(`/budget/overview?months=${months}`);
}
