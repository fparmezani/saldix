import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { FixedExpensesRepository } from './fixed-expenses.repository';

@Injectable()
export class FixedExpensesService {
  constructor(private readonly fixedExpensesRepository: FixedExpensesRepository) {}

  async listByMonth(userId: string, referenceMonth: string) {
    return this.fixedExpensesRepository.findByMonth(userId, referenceMonth);
  }

  async create(userId: string, dto: CreateFixedExpenseDto) {
    return this.fixedExpensesRepository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateFixedExpenseDto) {
    try {
      return await this.fixedExpensesRepository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Fixed expense not found');
    }
  }

  async remove(userId: string, id: string) {
    await this.fixedExpensesRepository.delete(userId, id);
  }
}
