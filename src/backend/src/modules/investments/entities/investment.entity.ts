export type InvestmentCategory = 'renda_fixa' | 'fiis' | 'acoes' | 'cripto' | 'outros';

export const SHARE_BASED_CATEGORIES: InvestmentCategory[] = ['fiis', 'acoes', 'cripto'];

export function isShareBasedCategory(category: InvestmentCategory): boolean {
  return SHARE_BASED_CATEGORIES.includes(category);
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  category: InvestmentCategory;
  investedAmount: number;
  currentAmount: number;
  ticker: string | null;
  quantity: number | null;
  marketPricePerUnit: number | null;
  targetPercentage: number | null;
  createdAt: string;
}
