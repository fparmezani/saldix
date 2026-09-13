import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateInvestmentInput, UpdateInvestmentInput } from '@saldix/shared-types';
import {
  createInvestment,
  deleteInvestment,
  fetchInvestments,
  fetchInvestmentsSummary,
  updateInvestment,
} from '../api/investments';

export function useInvestments() {
  return useQuery({
    queryKey: ['investments'],
    queryFn: fetchInvestments,
  });
}

export function useInvestmentsSummary() {
  return useQuery({
    queryKey: ['investments-summary'],
    queryFn: fetchInvestmentsSummary,
  });
}

function useInvalidateInvestments() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['investments'] });
    queryClient.invalidateQueries({ queryKey: ['investments-summary'] });
  };
}

export function useCreateInvestment() {
  const invalidate = useInvalidateInvestments();
  return useMutation({
    mutationFn: (input: CreateInvestmentInput) => createInvestment(input),
    onSuccess: invalidate,
  });
}

export function useUpdateInvestment() {
  const invalidate = useInvalidateInvestments();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInvestmentInput }) =>
      updateInvestment(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteInvestment() {
  const invalidate = useInvalidateInvestments();
  return useMutation({
    mutationFn: (id: string) => deleteInvestment(id),
    onSuccess: invalidate,
  });
}
