import { summarizeInvestmentsByCategory } from './investment-allocation.calculator';

describe('summarizeInvestmentsByCategory', () => {
  it('returns an empty array for an empty portfolio', () => {
    expect(summarizeInvestmentsByCategory([])).toEqual([]);
  });

  it('reports 100% allocated when a single category sums exactly to 100', () => {
    const result = summarizeInvestmentsByCategory([
      { category: 'fiis', investedAmount: 1000, currentAmount: 1100, targetPercentage: 50 },
      { category: 'fiis', investedAmount: 1000, currentAmount: 900, targetPercentage: 50 },
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        category: 'fiis',
        count: 2,
        allocatedPercentage: 100,
        totalInvested: 2000,
        totalCurrent: 2000,
      }),
    ]);
  });

  it('reports under-allocation when the category sums below 100', () => {
    const result = summarizeInvestmentsByCategory([
      { category: 'acoes', investedAmount: 500, currentAmount: 600, targetPercentage: 30 },
    ]);

    expect(result[0].allocatedPercentage).toBe(30);
  });

  it('reports over-allocation when the category sums above 100', () => {
    const result = summarizeInvestmentsByCategory([
      { category: 'acoes', investedAmount: 500, currentAmount: 600, targetPercentage: 70 },
      { category: 'acoes', investedAmount: 500, currentAmount: 400, targetPercentage: 50 },
    ]);

    expect(result[0].allocatedPercentage).toBe(120);
  });

  it('treats a null targetPercentage as 0 in the allocation sum', () => {
    const result = summarizeInvestmentsByCategory([
      { category: 'fiis', investedAmount: 1000, currentAmount: 1000, targetPercentage: null },
      { category: 'fiis', investedAmount: 1000, currentAmount: 1000, targetPercentage: 40 },
    ]);

    expect(result[0].allocatedPercentage).toBe(40);
  });

  it('keeps multiple categories independent and orders them by the fixed taxonomy order', () => {
    const result = summarizeInvestmentsByCategory([
      { category: 'outros', investedAmount: 300, currentAmount: 300, targetPercentage: null },
      { category: 'fiis', investedAmount: 1000, currentAmount: 1200, targetPercentage: 100 },
      { category: 'renda_fixa', investedAmount: 2000, currentAmount: 2100, targetPercentage: null },
    ]);

    expect(result.map((r) => r.category)).toEqual(['renda_fixa', 'fiis', 'outros']);
    expect(result.find((r) => r.category === 'renda_fixa')?.allocatedPercentage).toBe(0);
  });
});
