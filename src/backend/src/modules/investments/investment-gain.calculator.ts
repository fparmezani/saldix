export interface Gain {
  gainAmount: number;
  gainPercentage: number;
}

export function calculateGain(investedAmount: number, currentAmount: number): Gain {
  const gainAmount = currentAmount - investedAmount;
  const gainPercentage = investedAmount > 0 ? (gainAmount / investedAmount) * 100 : 0;
  return { gainAmount, gainPercentage };
}

export interface InvestmentsSummary {
  totalInvested: number;
  totalCurrent: number;
  totalGainAmount: number;
  totalGainPercentage: number;
}

export function summarizeInvestments(
  investments: { investedAmount: number; currentAmount: number }[],
): InvestmentsSummary {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.currentAmount, 0);
  const { gainAmount: totalGainAmount, gainPercentage: totalGainPercentage } = calculateGain(
    totalInvested,
    totalCurrent,
  );

  return { totalInvested, totalCurrent, totalGainAmount, totalGainPercentage };
}
