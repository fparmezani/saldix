import { BudgetSettings } from './budget-settings/entities/budget-settings.entity';

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  investAmount: number;
  balance: number;
}

/**
 * Fórmula única de saldo do orçamento: Receita − Despesas − Investir.
 * Centralizada aqui para nunca ser duplicada entre backend e frontend.
 */
export function calculateBudgetSummary(params: {
  totalIncome: number;
  totalExpenses: number;
  settings: BudgetSettings;
}): BudgetSummary {
  const { totalIncome, totalExpenses, settings } = params;

  const investAmount =
    settings.investMode === 'fixed'
      ? (settings.investFixedAmount ?? 0)
      : totalIncome * ((settings.investPercentage ?? 0) / 100);

  return {
    totalIncome,
    totalExpenses,
    investAmount,
    balance: totalIncome - totalExpenses - investAmount,
  };
}
