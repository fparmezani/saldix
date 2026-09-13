import { buildIncomeFromReceivable } from './future-receivables.factory';
import { FutureReceivable } from './future-receivable.entity';

function buildReceivable(overrides: Partial<FutureReceivable>): FutureReceivable {
  return {
    id: 'r1',
    userId: 'user-1',
    description: 'Venda de bolo de pote',
    amount: 200,
    expectedDate: '2026-10-01',
    status: 'pending',
    receivedAt: null,
    incomeType: 'extra',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('buildIncomeFromReceivable', () => {
  it('maps a confirmed receivable into an income DTO for the same month', () => {
    const receivable = buildReceivable({});

    const result = buildIncomeFromReceivable(receivable);

    expect(result).toEqual({
      type: 'extra',
      description: 'Venda de bolo de pote',
      amount: 200,
      referenceMonth: '2026-10-01',
    });
  });

  it('preserves the main income type', () => {
    const receivable = buildReceivable({ incomeType: 'main', expectedDate: '2026-12-15' });

    const result = buildIncomeFromReceivable(receivable);

    expect(result.type).toBe('main');
    expect(result.referenceMonth).toBe('2026-12-01');
  });
});
