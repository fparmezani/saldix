export type InvestMode = 'percentage' | 'fixed';

export interface BudgetSettings {
  referenceMonth: string;
  investMode: InvestMode;
  investPercentage: number | null;
  investFixedAmount: number | null;
}

export const DEFAULT_INVEST_PERCENTAGE = 20;

export function defaultBudgetSettings(referenceMonth: string): BudgetSettings {
  return {
    referenceMonth,
    investMode: 'percentage',
    investPercentage: DEFAULT_INVEST_PERCENTAGE,
    investFixedAmount: null,
  };
}
