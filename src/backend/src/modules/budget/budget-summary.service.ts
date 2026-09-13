import { Injectable } from '@nestjs/common';
import { FixedExpensesService } from '../expenses/fixed-expenses/fixed-expenses.service';
import { VariableExpensesService } from '../expenses/variable-expenses/variable-expenses.service';
import { IncomesService } from '../incomes/incomes.service';
import { BudgetSettingsService } from './budget-settings/budget-settings.service';
import { BudgetSummary, calculateBudgetSummary } from './budget-summary.calculator';

@Injectable()
export class BudgetSummaryService {
  constructor(
    private readonly incomesService: IncomesService,
    private readonly fixedExpensesService: FixedExpensesService,
    private readonly variableExpensesService: VariableExpensesService,
    private readonly budgetSettingsService: BudgetSettingsService,
  ) {}

  async calculate(userId: string, referenceMonth: string): Promise<BudgetSummary> {
    const [incomeBreakdown, fixedExpenses, variableExpenses, settings] = await Promise.all([
      this.incomesService.listByMonth(userId, referenceMonth),
      this.fixedExpensesService.listByMonth(userId, referenceMonth),
      this.variableExpensesService.listByMonth(userId, referenceMonth),
      this.budgetSettingsService.getForMonth(userId, referenceMonth),
    ]);

    const totalExpenses =
      fixedExpenses.reduce((sum, e) => sum + e.amount, 0) +
      variableExpenses.reduce((sum, e) => sum + e.amount, 0);

    return calculateBudgetSummary({
      totalIncome: incomeBreakdown.totalAmount,
      totalExpenses,
      settings,
    });
  }
}
