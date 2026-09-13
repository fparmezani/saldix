import { resolveOccurrenceDate } from './income-schedules.factory';

describe('resolveOccurrenceDate', () => {
  it('uses the recurrence day directly when the month has enough days', () => {
    expect(resolveOccurrenceDate(5, '2026-10-01')).toBe('2026-10-05');
  });

  it('clamps to the last day of a 30-day month', () => {
    expect(resolveOccurrenceDate(31, '2026-09-01')).toBe('2026-09-30');
  });

  it('clamps to the last day of February in a non-leap year', () => {
    expect(resolveOccurrenceDate(31, '2026-02-01')).toBe('2026-02-28');
  });

  it('clamps to the last day of February in a leap year', () => {
    expect(resolveOccurrenceDate(31, '2028-02-01')).toBe('2028-02-29');
  });

  it('keeps day 1 for any month', () => {
    expect(resolveOccurrenceDate(1, '2026-12-01')).toBe('2026-12-01');
  });
});
