import { describe, expect, it } from 'vitest';
import {
  annualToMonthlyRate,
  formatDuration,
  projectToMillion,
  requiredMonthlyContribution,
} from './first-million';

describe('first million calculator', () => {
  it('converts an effective annual rate to its equivalent monthly rate', () => {
    expect(annualToMonthlyRate(12)).toBeCloseTo(0.00948879, 7);
  });

  it('returns zero months when the target is already reached', () => {
    expect(
      projectToMillion({ initial: 1_000_000, monthlyContribution: 0, annualRatePercent: 0 }).months,
    ).toBe(0);
  });

  it('reaches one million with contributions and no interest', () => {
    const result = projectToMillion({
      initial: 0,
      monthlyContribution: 10_000,
      annualRatePercent: 0,
    });
    expect(result.months).toBe(100);
    expect(result.invested).toBe(1_000_000);
    expect(result.earnings).toBe(0);
  });

  it('calculates the contribution required for a fixed deadline', () => {
    expect(requiredMonthlyContribution({ initial: 0, annualRatePercent: 0, months: 100 })).toBe(
      10_000,
    );
  });

  it('recognizes the target calculated for an exact deadline despite floating-point residue', () => {
    const contribution = requiredMonthlyContribution({
      initial: 21_000,
      annualRatePercent: 8,
      months: 180,
    });
    const result = projectToMillion({
      initial: 21_000,
      monthlyContribution: contribution,
      annualRatePercent: 8,
      maxMonths: 180,
    });
    expect(result.reached).toBe(true);
    expect(result.months).toBe(180);
    expect(result.balance).toBeCloseTo(1_000_000, 2);
  });

  it('reports an unreachable target inside the projection limit', () => {
    const result = projectToMillion({ initial: 0, monthlyContribution: 0, annualRatePercent: 8 });
    expect(result.reached).toBe(false);
    expect(result.months).toBeNull();
  });

  it('formats years and remaining months', () => {
    expect(formatDuration(26)).toBe('2 anos e 2 meses');
  });
});
