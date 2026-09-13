import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateIncomeScheduleInput } from '@saldix/shared-types';
import { createIncomeSchedule, fetchIncomeSchedules, updateIncomeSchedule } from '../api/income-schedules';

export function useIncomeSchedules() {
  return useQuery({
    queryKey: ['income-schedules'],
    queryFn: fetchIncomeSchedules,
  });
}

function useInvalidateSchedules() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['income-schedules'] });
    queryClient.invalidateQueries({ queryKey: ['incomes'] });
  };
}

export function useCreateIncomeSchedule() {
  const invalidate = useInvalidateSchedules();
  return useMutation({
    mutationFn: (input: CreateIncomeScheduleInput) => createIncomeSchedule(input),
    onSuccess: invalidate,
  });
}

export function useToggleIncomeSchedule() {
  const invalidate = useInvalidateSchedules();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateIncomeSchedule(id, { active }),
    onSuccess: invalidate,
  });
}
