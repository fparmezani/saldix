export interface NetWorthSummary {
  totalLiquidity: number;
  totalInvestments: number;
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
}

export function calculateNetWorth(params: {
  totalLiquidity: number;
  totalInvestments: number;
  totalAssets: number;
  totalDebts: number;
}): NetWorthSummary {
  const { totalLiquidity, totalInvestments, totalAssets, totalDebts } = params;
  return {
    totalLiquidity,
    totalInvestments,
    totalAssets,
    totalDebts,
    netWorth: totalLiquidity + totalInvestments + totalAssets - totalDebts,
  };
}
