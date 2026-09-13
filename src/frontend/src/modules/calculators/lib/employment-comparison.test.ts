import { describe, expect, it } from 'vitest';
import {
  calculateInss2026,
  calculateIrrf2026,
  calculatePlrTax2026,
  compareEmploymentOffers,
} from './employment-comparison';

describe('employment comparison', () => {
  it('calculates progressive INSS up to the 2026 ceiling', () => {
    expect(calculateInss2026(1621)).toBeCloseTo(121.575, 3);
    expect(calculateInss2026(20_000)).toBeCloseTo(calculateInss2026(8475.55), 2);
  });

  it('applies the 2026 IRRF reduction for income up to R$ 5,000', () => {
    const inss = calculateInss2026(5000);
    expect(calculateIrrf2026(5000, inss)).toBe(0);
  });

  it('uses the exclusive PLR table', () => {
    expect(calculatePlrTax2026(8214.4)).toBe(0);
    expect(calculatePlrTax2026(10_000)).toBeCloseTo(139.75, 2);
  });

  it('includes benefits, paid rest and FGTS in the CLT package', () => {
    const result = compareEmploymentOffers({
      cltGrossMonthly: 8000,
      dependents: 0,
      benefits: [{ name: 'Vale-alimentação', monthlyValue: 800 }],
      benefitDeductionsMonthly: 0,
      plrAnnual: 8000,
      otherAnnualNet: 0,
      pjMonthlyRevenue: 12_000,
      pjTaxPercent: 10,
      pjFixedCostsMonthly: 500,
      pjPersonalBenefitsMonthly: 1000,
      pjUnpaidVacationDays: 30,
    });
    expect(result.clt.benefitsAnnual).toBe(9600);
    expect(result.clt.fgtsAnnual).toBeGreaterThan(0);
    expect(result.pj.productiveMonths).toBe(11);
    expect(result.pjBreakEvenMonthly).toBeGreaterThan(0);
  });
});
