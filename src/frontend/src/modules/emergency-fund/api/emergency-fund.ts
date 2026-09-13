import type {
  CreateEmergencyFundContributionInput,
  EmergencyFundContribution,
  EmergencyFundSettings,
  EmergencyFundStatus,
  UpdateEmergencyFundSettingsInput,
} from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchEmergencyFundSettings() {
  return apiFetch<EmergencyFundSettings | null>('/emergency-fund/settings');
}

export function updateEmergencyFundSettings(input: UpdateEmergencyFundSettingsInput) {
  return apiFetch<EmergencyFundSettings>('/emergency-fund/settings', {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function fetchEmergencyFundStatus() {
  return apiFetch<EmergencyFundStatus | null>('/emergency-fund/status');
}

export function fetchEmergencyFundContributions() {
  return apiFetch<EmergencyFundContribution[]>('/emergency-fund/contributions');
}

export function createEmergencyFundContribution(input: CreateEmergencyFundContributionInput) {
  return apiFetch<EmergencyFundContribution>('/emergency-fund/contributions', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
