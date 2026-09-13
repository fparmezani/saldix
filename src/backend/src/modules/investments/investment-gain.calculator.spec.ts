import { calculateGain, summarizeInvestments } from './investment-gain.calculator';

describe('calculateGain', () => {
  it('shows 0% / R$0 when current equals invested', () => {
    const result = calculateGain(2000, 2000);
    expect(result.gainAmount).toBe(0);
    expect(result.gainPercentage).toBe(0);
  });

  it('shows +20% / +R$400 when current grows from 2000 to 2400', () => {
    const result = calculateGain(2000, 2400);
    expect(result.gainAmount).toBe(400);
    expect(result.gainPercentage).toBe(20);
  });

  it('shows a negative gain when current drops below invested', () => {
    const result = calculateGain(2000, 1800);
    expect(result.gainAmount).toBe(-200);
    expect(result.gainPercentage).toBe(-10);
  });

  it('returns 0% when invested is 0 to avoid dividing by zero', () => {
    const result = calculateGain(0, 500);
    expect(result.gainAmount).toBe(500);
    expect(result.gainPercentage).toBe(0);
  });

  it('recalculates proportionally after a new contribution changes invested amount', () => {
    const result = calculateGain(2500, 2400);
    expect(result.gainAmount).toBe(-100);
    expect(result.gainPercentage).toBeCloseTo(-4, 5);
  });
});

describe('summarizeInvestments', () => {
  it('sums current amounts across multiple investments', () => {
    const result = summarizeInvestments([
      { investedAmount: 4500, currentAmount: 4900 },
      { investedAmount: 130000, currentAmount: 135000 },
      { investedAmount: 300, currentAmount: 300 },
    ]);

    expect(result.totalCurrent).toBe(140200);
    expect(result.totalInvested).toBe(134800);
    expect(result.totalGainAmount).toBe(5400);
  });

  it('returns zeros for an empty portfolio', () => {
    const result = summarizeInvestments([]);
    expect(result).toEqual({
      totalInvested: 0,
      totalCurrent: 0,
      totalGainAmount: 0,
      totalGainPercentage: 0,
    });
  });
});
