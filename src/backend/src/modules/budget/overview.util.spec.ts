import { buildMonthRange } from './overview.util';

describe('buildMonthRange', () => {
  it('returns a single month when count is 1', () => {
    expect(buildMonthRange(1, '2026-09-01')).toEqual(['2026-09-01']);
  });

  it('returns the last 3 months ending at the anchor, in chronological order', () => {
    expect(buildMonthRange(3, '2026-09-01')).toEqual(['2026-07-01', '2026-08-01', '2026-09-01']);
  });

  it('crosses a year boundary correctly', () => {
    expect(buildMonthRange(3, '2026-02-01')).toEqual(['2025-12-01', '2026-01-01', '2026-02-01']);
  });

  it('returns 12 months ending at the anchor', () => {
    const result = buildMonthRange(12, '2026-12-01');
    expect(result).toHaveLength(12);
    expect(result[0]).toBe('2026-01-01');
    expect(result[11]).toBe('2026-12-01');
  });
});
