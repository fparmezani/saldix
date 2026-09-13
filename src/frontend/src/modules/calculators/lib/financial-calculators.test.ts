import { describe, expect, it } from 'vitest';
import {
  calculateCompoundInterest,
  calculateDebtPlan,
  calculateInflation,
  compareCashAndInstallments,
  compareAmortization,
  compareFinancing,
} from './financial-calculators';

describe('financial calculators', () => {
  it('compares installments at present value', () => {
    const result = compareCashAndInstallments({
      cashPrice: 900,
      installmentAmount: 100,
      installments: 10,
      annualOpportunityRate: 0,
    });
    expect(result.recommendation).toBe('cash');
    expect(result.advantage).toBe(100);
  });
  it('calculates a debt without interest', () => {
    const result = calculateDebtPlan(1_000, 0, 100);
    expect(result.months).toBe(10);
    expect(result.totalInterest).toBe(0);
  });
  it('rejects a payment that does not cover interest', () => {
    expect(calculateDebtPlan(10_000, 10, 1_000).possible).toBe(false);
  });
  it('calculates Price and SAC without interest', () => {
    const result = compareFinancing(120_000, 0, 120);
    expect(result.pricePayment).toBe(1_000);
    expect(result.sacFirstPayment).toBe(1_000);
    expect(result.priceInterest).toBe(0);
  });
  it('separates contributions and compound earnings', () => {
    const result = calculateCompoundInterest(10_000, 1_000, 0, 12);
    expect(result.balance).toBe(22_000);
    expect(result.earnings).toBe(0);
  });
  it('calculates purchasing power under inflation', () => {
    const result = calculateInflation(10_000, 10, 1);
    expect(result.futureCost).toBeCloseTo(11_000, 2);
    expect(result.futurePurchasingPower).toBeCloseTo(9_090.91, 2);
  });
  it('compares Price amortization choices without interest', () => {
    const result = compareAmortization({
      balance: 100_000,
      annualRatePercent: 0,
      remainingMonths: 100,
      extraPayment: 20_000,
      system: 'price',
    });
    expect(result.baseline.firstPayment).toBe(1_000);
    expect(result.reducePayment.firstPayment).toBe(800);
    expect(result.reduceTerm.months).toBe(80);
    expect(result.eliminatedMonths).toBe(20);
  });
  it('compares SAC amortization choices without interest', () => {
    const result = compareAmortization({
      balance: 100_000,
      annualRatePercent: 0,
      remainingMonths: 100,
      extraPayment: 20_000,
      system: 'sac',
    });
    expect(result.reducePayment.firstPayment).toBe(800);
    expect(result.reduceTerm.months).toBe(80);
  });
  it('handles full early payoff', () => {
    const result = compareAmortization({
      balance: 50_000,
      annualRatePercent: 10,
      remainingMonths: 120,
      extraPayment: 50_000,
      system: 'sac',
    });
    expect(result.reducedBalance).toBe(0);
    expect(result.reducePayment.months).toBe(0);
    expect(result.reduceTerm.months).toBe(0);
  });
  it('rejects amortization above the current balance', () => {
    expect(() =>
      compareAmortization({
        balance: 50_000,
        annualRatePercent: 10,
        remainingMonths: 120,
        extraPayment: 50_001,
        system: 'price',
      }),
    ).toThrow();
  });
});
