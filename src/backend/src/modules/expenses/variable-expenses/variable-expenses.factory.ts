import { randomUUID } from 'crypto';

export interface BuildInstallmentsInput {
  categoryId: string;
  description: string;
  amount: number;
  expenseDate: string;
  installments: number;
}

export interface InstallmentRecord {
  categoryId: string;
  description: string;
  amount: number;
  expenseDate: string;
  installmentGroupId: string;
  installmentNumber: number;
  installmentTotal: number;
  cardId?: string | null;
  bankAccountId?: string | null;
}

/**
 * Divide o valor total em N parcelas, absorvendo a diferença de arredondamento
 * de centavos nas últimas parcelas, para que a soma sempre bata com o total original.
 */
export function buildInstallments(input: BuildInstallmentsInput): InstallmentRecord[] {
  const totalCents = Math.round(input.amount * 100);
  const n = input.installments;
  const baseCents = Math.floor(totalCents / n);
  const remainderCents = totalCents - baseCents * n;
  const groupId = randomUUID();

  const records: InstallmentRecord[] = [];
  for (let i = 1; i <= n; i++) {
    const extraCent = i > n - remainderCents ? 1 : 0;
    const amount = (baseCents + extraCent) / 100;

    records.push({
      categoryId: input.categoryId,
      description: input.description,
      amount,
      expenseDate: addMonthsClamped(input.expenseDate, i - 1),
      installmentGroupId: groupId,
      installmentNumber: i,
      installmentTotal: n,
    });
  }

  return records;
}

export function addMonthsClamped(dateStr: string, monthsToAdd: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetMonthIndex = month - 1 + monthsToAdd;
  const lastDayOfTargetMonth = new Date(Date.UTC(year, targetMonthIndex + 1, 0)).getUTCDate();
  const clampedDay = Math.min(day, lastDayOfTargetMonth);
  return new Date(Date.UTC(year, targetMonthIndex, clampedDay)).toISOString().slice(0, 10);
}
