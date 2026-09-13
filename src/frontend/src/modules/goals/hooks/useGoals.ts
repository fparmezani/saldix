import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateGoalContributionInput,
  CreateGoalInput,
  UpdateGoalInput,
} from '@saldix/shared-types';
import {
  createGoal,
  createGoalContribution,
  deleteGoal,
  fetchGoalContributions,
  fetchGoals,
  updateGoal,
} from '../api/goals';

export function useGoals() {
  return useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals,
  });
}

export function useGoalContributions(goalId: string | null) {
  return useQuery({
    queryKey: ['goal-contributions', goalId],
    queryFn: () => fetchGoalContributions(goalId as string),
    enabled: goalId !== null,
  });
}

function useInvalidateGoals() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['goals'] });
}

export function useCreateGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: (input: CreateGoalInput) => createGoal(input),
    onSuccess: invalidate,
  });
}

export function useUpdateGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGoalInput }) => updateGoal(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteGoal() {
  const invalidate = useInvalidateGoals();
  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: invalidate,
  });
}

export function useAddGoalContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, input }: { goalId: string; input: CreateGoalContributionInput }) =>
      createGoalContribution(goalId, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal-contributions', variables.goalId] });
    },
  });
}
