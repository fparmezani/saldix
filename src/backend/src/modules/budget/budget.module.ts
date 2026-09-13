import { Module } from '@nestjs/common';
import { ExpensesModule } from '../expenses/expenses.module';
import { IncomesModule } from '../incomes/incomes.module';
import { BudgetSettingsRepository } from './budget-settings/budget-settings.repository';
import { BudgetSettingsService } from './budget-settings/budget-settings.service';
import { BudgetController } from './budget.controller';
import { BudgetSummaryService } from './budget-summary.service';
import { OverviewService } from './overview.service';

@Module({
  imports: [IncomesModule, ExpensesModule],
  controllers: [BudgetController],
  providers: [
    BudgetSettingsService,
    BudgetSettingsRepository,
    BudgetSummaryService,
    OverviewService,
  ],
})
export class BudgetModule {}
