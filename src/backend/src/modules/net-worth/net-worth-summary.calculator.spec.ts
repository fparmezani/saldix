import { calculateNetWorth } from './net-worth-summary.calculator';

describe('calculateNetWorth', () => {
  it('sums liquidity and investments when there are no assets or debts', () => {
    const result = calculateNetWorth({
      totalLiquidity: 1572,
      totalInvestments: 135000,
      totalAssets: 0,
      totalDebts: 0,
    });

    expect(result.netWorth).toBe(136572);
  });

  it('adds a real estate asset with no debt to the total', () => {
    const result = calculateNetWorth({
      totalLiquidity: 1572,
      totalInvestments: 135000,
      totalAssets: 200000,
      totalDebts: 0,
    });

    expect(result.netWorth).toBe(336572);
  });

  it('nets out an apartment against its linked financing debt', () => {
    const result = calculateNetWorth({
      totalLiquidity: 0,
      totalInvestments: 0,
      totalAssets: 600000,
      totalDebts: 450000,
    });

    expect(result.netWorth).toBe(150000);
  });

  it('increases net worth when a debt is amortized', () => {
    const before = calculateNetWorth({
      totalLiquidity: 0,
      totalInvestments: 0,
      totalAssets: 600000,
      totalDebts: 450000,
    });
    const after = calculateNetWorth({
      totalLiquidity: 0,
      totalInvestments: 0,
      totalAssets: 600000,
      totalDebts: 400000,
    });

    expect(after.netWorth - before.netWorth).toBe(50000);
  });

  it('allows a negative net worth when debts exceed everything else', () => {
    const result = calculateNetWorth({
      totalLiquidity: 100,
      totalInvestments: 0,
      totalAssets: 0,
      totalDebts: 500,
    });

    expect(result.netWorth).toBe(-400);
  });
});
