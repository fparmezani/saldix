import { BadRequestException, Injectable } from '@nestjs/common';
import { BudgetSettingsRepository } from './budget-settings.repository';
import { UpdateBudgetSettingsDto } from './dto/update-budget-settings.dto';
import { BudgetSettings, defaultBudgetSettings } from './entities/budget-settings.entity';

@Injectable()
export class BudgetSettingsService {
  constructor(private readonly budgetSettingsRepository: BudgetSettingsRepository) {}

  async getForMonth(userId: string, referenceMonth: string): Promise<BudgetSettings> {
    const settings = await this.budgetSettingsRepository.findByMonth(userId, referenceMonth);
    return settings ?? defaultBudgetSettings(referenceMonth);
  }

  async upsert(userId: string, dto: UpdateBudgetSettingsDto): Promise<BudgetSettings> {
    if (dto.investMode === 'percentage' && dto.investPercentage === undefined) {
      throw new BadRequestException('investPercentage is required for percentage mode');
    }
    if (dto.investMode === 'fixed' && dto.investFixedAmount === undefined) {
      throw new BadRequestException('investFixedAmount is required for fixed mode');
    }

    return this.budgetSettingsRepository.upsert(userId, dto);
  }
}
