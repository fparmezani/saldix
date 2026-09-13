import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateEmergencyFundContributionInput,
  UpdateEmergencyFundSettingsInput,
} from '@saldix/shared-types';
import {
  createEmergencyFundContribution,
  fetchEmergencyFundContributions,
  fetchEmergencyFundSettings,
  fetchEmergencyFundStatus,
  updateEmergencyFundSettings,
} from '../api/emergency-fund';

export function useEmergencyFundSettings() {
  return useQuery({
    queryKey: ['emergency-fund-settings'],
    queryFn: fetchEmergencyFundSettings,
  });
}

export function useEmergencyFundStatus() {
  return useQuery({
    queryKey: ['emergency-fund-status'],
    queryFn: fetchEmergencyFundStatus,
  });
}

export function useEmergencyFundContributions() {
  return useQuery({
    queryKey: ['emergency-fund-contributions'],
    queryFn: fetchEmergencyFundContributions,
  });
}

function useInvalidateEmergencyFund() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['emergency-fund-settings'] });
    queryClient.invalidateQueries({ queryKey: ['emergency-fund-status'] });
    queryClient.invalidateQueries({ queryKey: ['emergency-fund-contributions'] });
  };
}

export function useUpdateEmergencyFundSettings() {
  const invalidate = useInvalidateEmergencyFund();
  return useMutation({
    mutationFn: (input: UpdateEmergencyFundSettingsInput) => updateEmergencyFundSettings(input),
    onSuccess: invalidate,
  });
}

export function useAddEmergencyFundContribution() {
  const invalidate = useInvalidateEmergencyFund();
  return useMutation({
    mutationFn: (input: CreateEmergencyFundContributionInput) =>
      createEmergencyFundContribution(input),
    onSuccess: invalidate,
  });
}
