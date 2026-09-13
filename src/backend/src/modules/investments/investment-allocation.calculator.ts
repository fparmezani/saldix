import { calculateGain } from './investment-gain.calculator';
import { InvestmentCategory } from './entities/investment.entity';

const CATEGORY_ORDER: InvestmentCategory[] = ['renda_fixa', 'fiis', 'acoes', 'cripto', 'outros'];

export interface InvestmentAllocationInput {
  category: InvestmentCategory;
  investedAmount: number;
  currentAmount: number;
  targetPercentage: number | null;
}

export interface CategoryAllocation {
  category: InvestmentCategory;
  count: number;
  totalInvested: number;
  totalCurrent: number;
  totalGainAmount: number;
  totalGainPercentage: number;
  allocatedPercentage: number;
}

/**
 * Agrupa investimentos por categoria e soma o percentual-alvo de cada um (tratando
 * ausência como 0). `allocatedPercentage` é só informativo — nunca bloqueia o cadastro
 * de um ativo isolado, já que só faz sentido bater 100% depois que todos os ativos
 * daquela categoria tiverem sido cadastrados.
 */
export function summarizeInvestmentsByCategory(
  investments: InvestmentAllocationInput[],
): CategoryAllocation[] {
  const groups = new Map<InvestmentCategory, InvestmentAllocationInput[]>();
  for (const investment of investments) {
    const group = groups.get(investment.category) ?? [];
    group.push(investment);
    groups.set(investment.category, group);
  }

  return CATEGORY_ORDER.filter((category) => groups.has(category)).map((category) => {
    const items = groups.get(category)!;
    const totalInvested = items.reduce((sum, i) => sum + i.investedAmount, 0);
    const totalCurrent = items.reduce((sum, i) => sum + i.currentAmount, 0);
    const allocatedPercentage = items.reduce((sum, i) => sum + (i.targetPercentage ?? 0), 0);
    const { gainAmount: totalGainAmount, gainPercentage: totalGainPercentage } = calculateGain(
      totalInvested,
      totalCurrent,
    );

    return {
      category,
      count: items.length,
      totalInvested,
      totalCurrent,
      totalGainAmount,
      totalGainPercentage,
      allocatedPercentage,
    };
  });
}
