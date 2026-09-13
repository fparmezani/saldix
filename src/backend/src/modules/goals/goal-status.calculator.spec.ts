import { calculateGoalStatus } from './goal-status.calculator';

describe('calculateGoalStatus', () => {
  it('suggests ~R$1.041,67/month for a R$25.000 goal 24 months away', () => {
    const result = calculateGoalStatus({
      targetAmount: 25000,
      targetDate: '2028-09-06',
      totalContributed: 0,
      today: '2026-09-06',
    });

    expect(result.monthlyRequired).toBeCloseTo(1041.6666, 3);
  });

  it('shows 0% progress with no contributions', () => {
    const result = calculateGoalStatus({
      targetAmount: 25000,
      targetDate: '2028-09-06',
      totalContributed: 0,
      today: '2026-09-06',
    });

    expect(result.progressPercentage).toBe(0);
  });

  it('shows 10.4% progress after a R$2.600 contribution against a R$25.000 goal', () => {
    const result = calculateGoalStatus({
      targetAmount: 25000,
      targetDate: '2028-09-06',
      totalContributed: 2600,
      today: '2026-09-06',
    });

    expect(result.progressPercentage).toBe(10.4);
  });

  it('flags a goal as overdue when the target date has passed and progress is below 100%', () => {
    const result = calculateGoalStatus({
      targetAmount: 10000,
      targetDate: '2026-01-01',
      totalContributed: 5000,
      today: '2026-09-06',
    });

    expect(result.isOverdue).toBe(true);
  });

  it('does not flag an overdue goal that already reached 100%', () => {
    const result = calculateGoalStatus({
      targetAmount: 10000,
      targetDate: '2026-01-01',
      totalContributed: 10000,
      today: '2026-09-06',
    });

    expect(result.isOverdue).toBe(false);
    expect(result.progressPercentage).toBe(100);
  });

  it('caps progress at 100% when contributions exceed the target', () => {
    const result = calculateGoalStatus({
      targetAmount: 10000,
      targetDate: '2028-01-01',
      totalContributed: 15000,
      today: '2026-09-06',
    });

    expect(result.progressPercentage).toBe(100);
    expect(result.isOverdue).toBe(false);
  });

  it('rounds up a partial month remaining, with a floor of 1 month', () => {
    const result = calculateGoalStatus({
      targetAmount: 1200,
      targetDate: '2026-09-20',
      totalContributed: 0,
      today: '2026-09-06',
    });

    expect(result.monthlyRequired).toBe(1200);
  });
});
