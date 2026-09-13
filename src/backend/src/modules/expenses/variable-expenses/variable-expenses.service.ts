import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariableExpenseDto } from './dto/create-variable-expense.dto';
import { UpdateVariableExpenseDto } from './dto/update-variable-expense.dto';
import { buildInstallments, InstallmentRecord } from './variable-expenses.factory';
import { VariableExpensesRepository } from './variable-expenses.repository';

@Injectable()
export class VariableExpensesService {
  constructor(private readonly variableExpensesRepository: VariableExpensesRepository) {}

  async listByMonth(userId: string, referenceMonth: string, categoryId?: string) {
    return this.variableExpensesRepository.findByMonth(userId, referenceMonth, categoryId);
  }

  async create(userId: string, dto: CreateVariableExpenseDto) {
    if (dto.installments && dto.installments >= 2) {
      const installments = buildInstallments({
        categoryId: dto.categoryId,
        description: dto.description,
        amount: dto.amount,
        expenseDate: dto.expenseDate,
        installments: dto.installments,
      }).map((installment) => ({
        ...installment,
        cardId: dto.cardId ?? null,
        bankAccountId: dto.bankAccountId ?? null,
      }));
      return this.variableExpensesRepository.createInstallments(userId, installments);
    }

    return this.variableExpensesRepository.createSingle(userId, {
      categoryId: dto.categoryId,
      description: dto.description,
      amount: dto.amount,
      expenseDate: dto.expenseDate,
      cardId: dto.cardId ?? null,
      bankAccountId: dto.bankAccountId ?? null,
    });
  }

  /**
   * Cria parcelas a partir de registros já montados (usado pela importação de fatura,
   * que gera parcelas a partir do meio da série via remaining-installments.factory).
   */
  async createFromInstallmentRecords(userId: string, records: InstallmentRecord[]) {
    return this.variableExpensesRepository.createInstallments(userId, records);
  }

  async update(userId: string, id: string, dto: UpdateVariableExpenseDto) {
    try {
      return await this.variableExpensesRepository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Variable expense not found');
    }
  }

  async remove(userId: string, id: string) {
    await this.variableExpensesRepository.delete(userId, id);
  }
}
