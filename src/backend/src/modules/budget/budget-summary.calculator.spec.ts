import { calculateBudgetSummary } from './budget-summary.calculator';
import { BudgetSettings } from './budget-settings/entities/budget-settings.entity';

function buildSettings(overrides: Partial<BudgetSettings>): BudgetSettings {
  return {
    referenceMonth: '2026-09-01',
    investMode: 'percentage',
    investPercentage: 20,
    investFixedAmount: null,
    ...overrides,
  };
}

describe('calculateBudgetSummary', () => {
  it('calculates 20% invest suggestion with no expenses (default settings)', () => {
    const result = calculateBudgetSummary({
      totalIncome: 5350,
      totalExpenses: 0,
      settings: buildSettings({}),
    });

    expect(result.investAmount).toBe(1070);
    expect(result.balance).toBe(4280);
  });

  it('recalculates invest amount when percentage is adjusted to 10%', () => {
    const result = calculateBudgetSummary({
      totalIncome: 5350,
      totalExpenses: 0,
      settings: buildSettings({ investPercentage: 10 }),
    });

    expect(result.investAmount).toBe(535);
    expect(result.balance).toBe(4815);
  });

  it('uses a fixed invest amount regardless of income when in fixed mode', () => {
    const result = calculateBudgetSummary({
      totalIncome: 5350,
      totalExpenses: 0,
      settings: buildSettings({ investMode: 'fixed', investFixedAmount: 700, investPercentage: null }),
    });

    expect(result.investAmount).toBe(700);
    expect(result.balance).toBe(4650);
  });

  it('subtracts both expenses and invest amount from income (acceptance example)', () => {
    const result = calculateBudgetSummary({
      totalIncome: 5350,
      totalExpenses: 3250,
      settings: buildSettings({ investPercentage: 20 }),
    });

    expect(result.investAmount).toBe(1070);
    expect(result.balance).toBe(1030);
  });

  it('treats a null percentage as 0% invest', () => {
    const result = calculateBudgetSummary({
      totalIncome: 1000,
      totalExpenses: 0,
      settings: buildSettings({ investPercentage: null }),
    });

    expect(result.investAmount).toBe(0);
    expect(result.balance).toBe(1000);
  });

  it('allows a negative balance when expenses and invest exceed income', () => {
    const result = calculateBudgetSummary({
      totalIncome: 1000,
      totalExpenses: 900,
      settings: buildSettings({ investPercentage: 20 }),
    });

    expect(result.investAmount).toBe(200);
    expect(result.balance).toBe(-100);
  });
});
