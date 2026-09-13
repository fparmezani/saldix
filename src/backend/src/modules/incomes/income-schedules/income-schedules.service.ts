import { Injectable, NotFoundException } from '@nestjs/common';
import { IncomesRepository } from '../incomes.repository';
import { CreateIncomeScheduleDto } from './dto/create-income-schedule.dto';
import { UpdateIncomeScheduleDto } from './dto/update-income-schedule.dto';
import { IncomeSchedulesRepository } from './income-schedules.repository';

@Injectable()
export class IncomeSchedulesService {
  constructor(
    private readonly incomeSchedulesRepository: IncomeSchedulesRepository,
    private readonly incomesRepository: IncomesRepository,
  ) {}

  async listAll(userId: string) {
    return this.incomeSchedulesRepository.findAllByUser(userId);
  }

  async create(userId: string, dto: CreateIncomeScheduleDto) {
    return this.incomeSchedulesRepository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateIncomeScheduleDto) {
    try {
      return await this.incomeSchedulesRepository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Income schedule not found');
    }
  }

  async isActive(userId: string, id: string): Promise<boolean> {
    const schedule = await this.incomeSchedulesRepository.findById(userId, id);
    return schedule?.active ?? false;
  }

  /**
   * Gera, de forma idempotente, a ocorrência do mês para cada renda recorrente
   * ativa do usuário que ainda não tenha sido lançada naquele mês.
   */
  async ensureGeneratedForMonth(userId: string, referenceMonth: string): Promise<void> {
    const activeSchedules = await this.incomeSchedulesRepository.findActiveByUser(userId);

    for (const schedule of activeSchedules) {
      const alreadyGenerated = await this.incomesRepository.existsForScheduleAndMonth(
        userId,
        schedule.id,
        referenceMonth,
      );
      if (alreadyGenerated) continue;

      await this.incomesRepository.create(
        userId,
        {
          type: schedule.type,
          description: schedule.description,
          amount: schedule.amount,
          referenceMonth,
        },
        null,
        schedule.id,
      );
    }
  }
}
