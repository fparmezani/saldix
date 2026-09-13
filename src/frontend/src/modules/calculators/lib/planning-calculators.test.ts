import { describe, expect, it } from 'vitest';
import {
  calculateFinancialIndependence,
  calculateNetSalary2026,
  calculateRetirementPlan,
  compareDebtStrategies,
  compareInvestments,
  compareRentAndBuy,
  correctValueByMonthlyRates,
} from './planning-calculators';

describe('planning calculators', () => {
  it('orders investments by net result', () => {
    const result = compareInvestments({
      initial: 1000,
      monthlyContribution: 0,
      years: 1,
      inflationPercent: 0,
      options: [
        { name: 'A', annualRatePercent: 10, incomeTaxPercent: 0, annualFeePercent: 0 },
        { name: 'B', annualRatePercent: 12, incomeTaxPercent: 50, annualFeePercent: 0 },
      ],
    });
    expect(result[0].name).toBe('A');
  });
  it('finds an independence target from the withdrawal rate', () => {
    const result = calculateFinancialIndependence({
      monthlyCost: 5000,
      coveragePercent: 100,
      withdrawalRatePercent: 4,
      currentInvestments: 0,
      monthlyContribution: 1000,
      annualRealReturnPercent: 0,
    });
    expect(result.target).toBe(1_500_000);
  });
  it('compares avalanche and snowball debt strategies', () => {
    const result = compareDebtStrategies(
      [
        { name: 'A', balance: 1000, monthlyRatePercent: 5, minimumPayment: 100 },
        { name: 'B', balance: 500, monthlyRatePercent: 1, minimumPayment: 100 },
      ],
      200,
    );
    expect(result.avalanche.possible).toBe(true);
    expect(result.snowball.possible).toBe(true);
    expect(result.avalanche.totalInterest).toBeLessThanOrEqual(result.snowball.totalInterest);
  });
  it('calculates a positive net salary', () => {
    expect(
      calculateNetSalary2026({
        grossSalary: 5000,
        taxableExtras: 0,
        dependents: 0,
        otherDeductions: 0,
      }).net,
    ).toBeGreaterThan(0);
  });
  it('compounds monthly correction rates', () => {
    expect(correctValueByMonthlyRates(1000, [1, 1]).correctedValue).toBeCloseTo(1020.1, 2);
  });
  it('calculates a retirement funding gap', () => {
    const result = calculateRetirementPlan({
      currentAge: 40,
      retirementAge: 60,
      desiredMonthlyIncome: 5000,
      expectedMonthlyPension: 1000,
      currentInvestments: 0,
      monthlyContribution: 0,
      annualRealReturnPercent: 0,
      withdrawalRatePercent: 4,
    });
    expect(result.requiredPortfolio).toBe(1_200_000);
    expect(result.onTrack).toBe(false);
  });
  it('compares rent and buy without producing invalid values', () => {
    const result = compareRentAndBuy({
      propertyPrice: 500000,
      downPayment: 100000,
      acquisitionCostPercent: 5,
      financingAnnualRate: 10,
      financingMonths: 360,
      monthlyRent: 2500,
      annualRentAdjustment: 5,
      annualPropertyAppreciation: 5,
      annualInvestmentReturn: 8,
      annualMaintenancePercent: 1,
      horizonYears: 10,
    });
    expect(Number.isFinite(result.buyerNetWorth)).toBe(true);
    expect(Number.isFinite(result.renterNetWorth)).toBe(true);
  });
});
