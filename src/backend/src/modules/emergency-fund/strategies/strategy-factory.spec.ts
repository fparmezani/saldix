import { BasicProtectionStrategy } from './basic-protection.strategy';
import { ShieldedProtectionStrategy } from './shielded-protection.strategy';
import { strategyFor } from './strategy-factory';

describe('strategyFor', () => {
  it('returns a 6-month strategy for basic protection', () => {
    const strategy = strategyFor('basic');
    expect(strategy).toBeInstanceOf(BasicProtectionStrategy);
    expect(strategy.monthsOfProtection()).toBe(6);
  });

  it('returns a 12-month strategy for shielded protection', () => {
    const strategy = strategyFor('shielded');
    expect(strategy).toBeInstanceOf(ShieldedProtectionStrategy);
    expect(strategy.monthsOfProtection()).toBe(12);
  });
});
