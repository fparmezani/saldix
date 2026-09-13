import { CreateIncomeDto } from '../dto/create-income.dto';
import { FutureReceivable } from './future-receivable.entity';

/**
 * Centraliza a criação do Income a partir de um FutureReceivable confirmado,
 * evitando duplicar essa transformação em múltiplos pontos do código.
 */
export function buildIncomeFromReceivable(receivable: FutureReceivable): CreateIncomeDto {
  return {
    type: receivable.incomeType,
    description: receivable.description,
    amount: receivable.amount,
    referenceMonth: `${receivable.expectedDate.slice(0, 7)}-01`,
  };
}
