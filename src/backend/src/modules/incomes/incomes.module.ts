import { Module } from '@nestjs/common';
import { FutureReceivablesController } from './future-receivables/future-receivables.controller';
import { FutureReceivablesRepository } from './future-receivables/future-receivables.repository';
import { FutureReceivablesService } from './future-receivables/future-receivables.service';
import { IncomeSchedulesController } from './income-schedules/income-schedules.controller';
import { IncomeSchedulesRepository } from './income-schedules/income-schedules.repository';
import { IncomeSchedulesService } from './income-schedules/income-schedules.service';
import { IncomesController } from './incomes.controller';
import { IncomesRepository } from './incomes.repository';
import { IncomesService } from './incomes.service';

@Module({
  controllers: [IncomesController, FutureReceivablesController, IncomeSchedulesController],
  providers: [
    IncomesService,
    IncomesRepository,
    FutureReceivablesService,
    FutureReceivablesRepository,
    IncomeSchedulesService,
    IncomeSchedulesRepository,
  ],
  exports: [IncomesService],
})
export class IncomesModule {}
