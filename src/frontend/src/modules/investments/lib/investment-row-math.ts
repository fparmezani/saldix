export interface InvestmentDraft {
  name: string;
  ticker: string;
  marketPricePerUnit: string;
  quantity: string;
  investedAmount: string;
  currentAmount: string;
  targetPercentage: string;
}

export const BLANK_INVESTMENT_DRAFT: InvestmentDraft = {
  name: '',
  ticker: '',
  marketPricePerUnit: '',
  quantity: '',
  investedAmount: '',
  currentAmount: '',
  targetPercentage: '',
};

export interface Gain {
  gainAmount: number;
  gainPercentage: number;
}

/** Espelha investment-gain.calculator.ts do backend — shared-types só tem schemas, sem funções. */
export function computeGain(investedAmount: number, currentAmount: number): Gain {
  const gainAmount = currentAmount - investedAmount;
  const gainPercentage = investedAmount > 0 ? (gainAmount / investedAmount) * 100 : 0;
  return { gainAmount, gainPercentage };
}

export function computeResultValue(quantity: string, marketPricePerUnit: string): number | null {
  if (quantity === '' || marketPricePerUnit === '') return null;
  const qty = Number(quantity);
  const price = Number(marketPricePerUnit);
  return Number.isFinite(qty) && Number.isFinite(price) ? qty * price : null;
}

export function computeWeightPercentage(
  currentAmount: number,
  totalCurrent: number | undefined,
): number | null {
  if (!totalCurrent || totalCurrent <= 0) return null;
  return (currentAmount / totalCurrent) * 100;
}

export function validateInvestmentDraft(draft: InvestmentDraft, shareBased: boolean): string | null {
  if (draft.name.trim() === '') return 'Informe um nome para o investimento.';

  const invested = Number(draft.investedAmount);
  if (draft.investedAmount === '' || !Number.isFinite(invested) || invested < 0) {
    return 'Informe um valor investido válido.';
  }

  if (shareBased) {
    if (draft.ticker.trim() === '') return 'Informe o ticker.';

    const quantity = Number(draft.quantity);
    if (draft.quantity === '' || !Number.isFinite(quantity) || quantity <= 0) {
      return 'Informe uma quantidade válida.';
    }

    const price = Number(draft.marketPricePerUnit);
    if (draft.marketPricePerUnit === '' || !Number.isFinite(price) || price <= 0) {
      return 'Informe o preço de mercado.';
    }
  }

  return null;
}

export function draftFromInvestment(investment: {
  name: string;
  ticker: string | null;
  marketPricePerUnit: number | null;
  quantity: number | null;
  investedAmount: number;
  currentAmount: number;
  targetPercentage: number | null;
}): InvestmentDraft {
  return {
    name: investment.name,
    ticker: investment.ticker ?? '',
    marketPricePerUnit: investment.marketPricePerUnit !== null ? String(investment.marketPricePerUnit) : '',
    quantity: investment.quantity !== null ? String(investment.quantity) : '',
    investedAmount: String(investment.investedAmount),
    currentAmount: String(investment.currentAmount),
    targetPercentage: investment.targetPercentage !== null ? String(investment.targetPercentage) : '',
  };
}
