import { EmergencyFundSettings } from './settings/entities/emergency-fund-settings.entity';
import { strategyFor } from './strategies/strategy-factory';

export interface EmergencyFundStatus {
  protectionType: EmergencyFundSettings['protectionType'];
  targetAmount: number;
  totalContributed: number;
  progressPercentage: number;
}

export function calculateEmergencyFundStatus(
  settings: EmergencyFundSettings,
  totalContributed: number,
): EmergencyFundStatus {
  const months = strategyFor(settings.protectionType).monthsOfProtection();
  const targetAmount = settings.monthlyEssentialCost * months;
  const progressPercentage =
    targetAmount > 0 ? Math.min(100, Math.round((totalContributed / targetAmount) * 100)) : 0;

  return {
    protectionType: settings.protectionType,
    targetAmount,
    totalContributed,
    progressPercentage,
  };
}
