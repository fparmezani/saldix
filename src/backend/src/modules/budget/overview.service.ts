import { Injectable } from '@nestjs/common';
import { BudgetSummaryService } from './budget-summary.service';
import { buildMonthRange, currentMonth } from './overview.util';

export interface OverviewPoint {
  month: string;
  totalIncome: number;
  totalExpenses: number;
}

@Injectable()
export class OverviewService {
  constructor(private readonly budgetSummaryService: BudgetSummaryService) {}

  async getSeries(userId: string, months: number): Promise<OverviewPoint[]> {
    const range = buildMonthRange(months, currentMonth());

    const points = await Promise.all(
      range.map(async (month) => {
        const summary = await this.budgetSummaryService.calculate(userId, month);
        return { month, totalIncome: summary.totalIncome, totalExpenses: summary.totalExpenses };
      }),
    );

    return points;
  }
}
