import { calculateEmergencyFundStatus } from './emergency-fund-status.calculator';

describe('calculateEmergencyFundStatus', () => {
  it('calculates a R$18.000 target for basic protection with R$3.000 essential cost', () => {
    const result = calculateEmergencyFundStatus(
      { protectionType: 'basic', monthlyEssentialCost: 3000 },
      0,
    );

    expect(result.targetAmount).toBe(18000);
  });

  it('calculates a R$36.000 target for shielded protection with the same essential cost', () => {
    const result = calculateEmergencyFundStatus(
      { protectionType: 'shielded', monthlyEssentialCost: 3000 },
      0,
    );

    expect(result.targetAmount).toBe(36000);
  });

  it('shows 0% progress with no contributions', () => {
    const result = calculateEmergencyFundStatus(
      { protectionType: 'basic', monthlyEssentialCost: 3000 },
      0,
    );

    expect(result.progressPercentage).toBe(0);
  });

  it('shows ~6% progress after a R$1.000 contribution against an R$18.000 target', () => {
    const result = calculateEmergencyFundStatus(
      { protectionType: 'basic', monthlyEssentialCost: 3000 },
      1000,
    );

    expect(result.progressPercentage).toBe(6);
  });

  it('caps progress at 100% even when contributions exceed the target', () => {
    const result = calculateEmergencyFundStatus(
      { protectionType: 'basic', monthlyEssentialCost: 3000 },
      25000,
    );

    expect(result.progressPercentage).toBe(100);
  });

  it('shows exactly 100% when contributions equal the target', () => {
    const result = calculateEmergencyFundStatus(
      { protectionType: 'basic', monthlyEssentialCost: 3000 },
      18000,
    );

    expect(result.progressPercentage).toBe(100);
  });
});
