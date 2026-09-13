import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module';
import { BudgetModule } from './modules/budget/budget.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { EmergencyFundModule } from './modules/emergency-fund/emergency-fund.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { GoalsModule } from './modules/goals/goals.module';
import { IncomesModule } from './modules/incomes/incomes.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { NetWorthModule } from './modules/net-worth/net-worth.module';
import { SupabaseModule } from './shared/supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    SupabaseModule,
    IncomesModule,
    CategoriesModule,
    ExpensesModule,
    BudgetModule,
    EmergencyFundModule,
    GoalsModule,
    InvestmentsModule,
    NetWorthModule,
    BankAccountsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
