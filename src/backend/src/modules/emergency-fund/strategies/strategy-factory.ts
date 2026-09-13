import { ProtectionType } from '../settings/entities/emergency-fund-settings.entity';
import { BasicProtectionStrategy } from './basic-protection.strategy';
import { EmergencyFundStrategy } from './emergency-fund-strategy.interface';
import { ShieldedProtectionStrategy } from './shielded-protection.strategy';

export function strategyFor(protectionType: ProtectionType): EmergencyFundStrategy {
  return protectionType === 'shielded'
    ? new ShieldedProtectionStrategy()
    : new BasicProtectionStrategy();
}
