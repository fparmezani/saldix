export type ProtectionType = 'basic' | 'shielded';

export interface EmergencyFundSettings {
  protectionType: ProtectionType;
  monthlyEssentialCost: number;
}
