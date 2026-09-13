import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';
import { IncomeSchedulesService } from './income-schedules/income-schedules.service';
import { IncomesRepository } from './incomes.repository';

export interface IncomeBreakdown {
  incomes: Income[];
  totalAmount: number;
  percentageByType: Record<string, number>;
}

@Injectable()
export class IncomesService {
  constructor(
    private readonly incomesRepository: IncomesRepository,
    private readonly incomeSchedulesService: IncomeSchedulesService,
  ) {}

  async listByMonth(userId: string, referenceMonth: string): Promise<IncomeBreakdown> {
    await this.incomeSchedulesService.ensureGeneratedForMonth(userId, referenceMonth);
    const incomes = await this.incomesRepository.findByMonth(userId, referenceMonth);
    return this.buildBreakdown(incomes);
  }

  buildBreakdown(incomes: Income[]): IncomeBreakdown {
    const totalAmount = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalsByType = incomes.reduce<Record<string, number>>((acc, income) => {
      acc[income.type] = (acc[income.type] ?? 0) + income.amount;
      return acc;
    }, {});

    const percentageByType = Object.fromEntries(
      Object.entries(totalsByType).map(([type, amount]) => [
        type,
        totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
      ]),
    );

    return { incomes, totalAmount, percentageByType };
  }

  async create(userId: string, dto: CreateIncomeDto, futureReceivableId: string | null = null) {
    return this.incomesRepository.create(userId, dto, futureReceivableId);
  }

  async update(userId: string, id: string, dto: UpdateIncomeDto) {
    try {
      return await this.incomesRepository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Income not found');
    }
  }

  async remove(userId: string, id: string) {
    const income = await this.incomesRepository.findById(userId, id);
    if (!income) {
      throw new NotFoundException('Income not found');
    }
    if (income.incomeScheduleId) {
      const scheduleActive = await this.incomeSchedulesService.isActive(
        userId,
        income.incomeScheduleId,
      );
      if (scheduleActive) {
        throw new BadRequestException(
          'Esta receita é gerada por uma renda recorrente ativa. Desative a renda recorrente antes de excluir esta ocorrência.',
        );
      }
    }

    await this.incomesRepository.delete(userId, id);
  }
}
