import type {
  CreateGoalContributionInput,
  CreateGoalInput,
  GoalContribution,
  GoalWithStatus,
  UpdateGoalInput,
} from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchGoals() {
  return apiFetch<GoalWithStatus[]>('/goals');
}

export function createGoal(input: CreateGoalInput) {
  return apiFetch<GoalWithStatus>('/goals', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateGoal(id: string, input: UpdateGoalInput) {
  return apiFetch<GoalWithStatus>(`/goals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function deleteGoal(id: string) {
  return apiFetch<void>(`/goals/${id}`, { method: 'DELETE' });
}

export function fetchGoalContributions(goalId: string) {
  return apiFetch<GoalContribution[]>(`/goals/${goalId}/contributions`);
}

export function createGoalContribution(goalId: string, input: CreateGoalContributionInput) {
  return apiFetch<GoalContribution>(`/goals/${goalId}/contributions`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
