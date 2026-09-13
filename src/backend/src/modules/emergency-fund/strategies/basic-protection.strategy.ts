import { EmergencyFundStrategy } from './emergency-fund-strategy.interface';

/** Recomendada para renda fixa (CLT): 6 meses de custo essencial. */
export class BasicProtectionStrategy implements EmergencyFundStrategy {
  monthsOfProtection(): number {
    return 6;
  }
}
