import { Module } from '@nestjs/common';
import { FixedExpensesController } from './fixed-expenses/fixed-expenses.controller';
import { FixedExpensesRepository } from './fixed-expenses/fixed-expenses.repository';
import { FixedExpensesService } from './fixed-expenses/fixed-expenses.service';
import { VariableExpensesController } from './variable-expenses/variable-expenses.controller';
import { VariableExpensesRepository } from './variable-expenses/variable-expenses.repository';
import { VariableExpensesService } from './variable-expenses/variable-expenses.service';

@Module({
  controllers: [FixedExpensesController, VariableExpensesController],
  providers: [
    FixedExpensesService,
    FixedExpensesRepository,
    VariableExpensesService,
    VariableExpensesRepository,
  ],
  exports: [FixedExpensesService, VariableExpensesService],
})
export class ExpensesModule {}
