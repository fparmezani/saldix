import { randomUUID } from 'crypto';
import {
  addMonthsClamped,
  InstallmentRecord,
} from '../../expenses/variable-expenses/variable-expenses.factory';

export interface BuildRemainingInstallmentsInput {
  categoryId: string;
  description: string;
  installmentAmount: number;
  expenseDate: string;
  currentInstallment: number;
  totalInstallments: number;
  cardId?: string | null;
  bankAccountId?: string | null;
}

/**
 * Variante de `buildInstallments` (Fase 2) para quando a fatura importada já mostra
 * uma parcela no meio da série (ex: "Farmácia 5/12"). Diferente da original, não
 * recebe um valor total pra dividir — a fatura já mostra o valor da parcela
 * individual, então cada registro gerado usa esse mesmo valor diretamente. Gera só
 * da parcela atual em diante (nunca retroage as anteriores, evitando duplicidade
 * com importações de meses passados).
 */
export function buildRemainingInstallments(
  input: BuildRemainingInstallmentsInput,
): InstallmentRecord[] {
  const groupId = randomUUID();
  const records: InstallmentRecord[] = [];

  for (let i = input.currentInstallment; i <= input.totalInstallments; i++) {
    records.push({
      categoryId: input.categoryId,
      description: input.description,
      amount: input.installmentAmount,
      expenseDate: addMonthsClamped(input.expenseDate, i - input.currentInstallment),
      installmentGroupId: groupId,
      installmentNumber: i,
      installmentTotal: input.totalInstallments,
      cardId: input.cardId ?? null,
      bankAccountId: input.bankAccountId ?? null,
    });
  }

  return records;
}
