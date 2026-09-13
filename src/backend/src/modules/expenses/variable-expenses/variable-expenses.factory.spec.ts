import { buildInstallments } from './variable-expenses.factory';

describe('buildInstallments', () => {
  it('splits an evenly divisible amount into equal installments', () => {
    const result = buildInstallments({
      categoryId: 'cat-1',
      description: 'Roupa',
      amount: 200,
      expenseDate: '2026-09-05',
      installments: 5,
    });

    expect(result).toHaveLength(5);
    expect(result.every((r) => r.amount === 40)).toBe(true);
    expect(result.map((r) => r.installmentNumber)).toEqual([1, 2, 3, 4, 5]);
    expect(result.every((r) => r.installmentTotal === 5)).toBe(true);
    expect(result.every((r) => r.installmentGroupId === result[0].installmentGroupId)).toBe(true);
  });

  it('generates consecutive monthly dates starting from the base date', () => {
    const result = buildInstallments({
      categoryId: 'cat-1',
      description: 'Roupa',
      amount: 200,
      expenseDate: '2026-09-05',
      installments: 3,
    });

    expect(result.map((r) => r.expenseDate)).toEqual(['2026-09-05', '2026-10-05', '2026-11-05']);
  });

  it('absorbs rounding remainder into the last installments', () => {
    const result = buildInstallments({
      categoryId: 'cat-1',
      description: 'Mercado',
      amount: 100,
      expenseDate: '2026-09-01',
      installments: 3,
    });

    expect(result.map((r) => r.amount)).toEqual([33.33, 33.33, 33.34]);
    const sum = result.reduce((acc, r) => acc + r.amount, 0);
    expect(Math.round(sum * 100) / 100).toBe(100);
  });

  it('clamps installment dates when the base day does not exist in a shorter month', () => {
    const result = buildInstallments({
      categoryId: 'cat-1',
      description: 'Assinatura',
      amount: 90,
      expenseDate: '2026-01-31',
      installments: 3,
    });

    expect(result.map((r) => r.expenseDate)).toEqual(['2026-01-31', '2026-02-28', '2026-03-31']);
  });

  it('handles a single-cent remainder correctly for 2 installments', () => {
    const result = buildInstallments({
      categoryId: 'cat-1',
      description: 'Presente',
      amount: 0.01 * 3,
      expenseDate: '2026-09-01',
      installments: 2,
    });

    expect(result.map((r) => r.amount)).toEqual([0.01, 0.02]);
  });
});
