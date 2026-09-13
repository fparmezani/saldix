import { buildRemainingInstallments } from './remaining-installments.factory';

describe('buildRemainingInstallments', () => {
  it('generates installments from the current one through the last (5/12 → 8 records)', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-09-05',
      currentInstallment: 5,
      totalInstallments: 12,
    });

    expect(result).toHaveLength(8);
    expect(result.map((r) => r.installmentNumber)).toEqual([5, 6, 7, 8, 9, 10, 11, 12]);
    expect(result.every((r) => r.installmentTotal === 12)).toBe(true);
  });

  it('uses the exact installment amount for every generated record, without redividing', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-09-05',
      currentInstallment: 5,
      totalInstallments: 12,
    });

    expect(result.every((r) => r.amount === 45)).toBe(true);
  });

  it('generates a single record when the current installment is the last one', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-09-05',
      currentInstallment: 12,
      totalInstallments: 12,
    });

    expect(result).toHaveLength(1);
    expect(result[0].installmentNumber).toBe(12);
  });

  it('generates consecutive monthly dates starting from the invoice month', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-11-05',
      currentInstallment: 11,
      totalInstallments: 12,
    });

    expect(result.map((r) => r.expenseDate)).toEqual(['2026-11-05', '2026-12-05']);
  });

  it('crosses the year boundary correctly', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-12-05',
      currentInstallment: 12,
      totalInstallments: 12,
    });

    expect(result[0].expenseDate).toBe('2026-12-05');
  });

  it('shares the same installmentGroupId across all generated records', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-09-05',
      currentInstallment: 5,
      totalInstallments: 12,
    });

    const groupIds = new Set(result.map((r) => r.installmentGroupId));
    expect(groupIds.size).toBe(1);
  });

  it('carries the cardId onto every generated record', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-09-05',
      currentInstallment: 5,
      totalInstallments: 12,
      cardId: 'card-1',
    });

    expect(result.every((r) => r.cardId === 'card-1')).toBe(true);
  });

  it('carries the bankAccountId onto every generated record', () => {
    const result = buildRemainingInstallments({
      categoryId: 'cat-1',
      description: 'Farmacia',
      installmentAmount: 45,
      expenseDate: '2026-09-05',
      currentInstallment: 5,
      totalInstallments: 12,
      bankAccountId: 'account-1',
    });

    expect(result.every((r) => r.bankAccountId === 'account-1')).toBe(true);
  });
});
