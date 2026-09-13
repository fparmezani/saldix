import { EmergencyFundStrategy } from './emergency-fund-strategy.interface';

/** Recomendada para renda variável (empreendedores): 12 meses de custo essencial. */
export class ShieldedProtectionStrategy implements EmergencyFundStrategy {
  monthsOfProtection(): number {
    return 12;
  }
}
