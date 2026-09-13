import { Module } from '@nestjs/common';
import { InvestmentsModule } from '../investments/investments.module';
import { AssetsRepository } from './assets/assets.repository';
import { AssetsService } from './assets/assets.service';
import { DebtsRepository } from './debts/debts.repository';
import { DebtsService } from './debts/debts.service';
import { LiquidAccountsRepository } from './liquid-accounts/liquid-accounts.repository';
import { LiquidAccountsService } from './liquid-accounts/liquid-accounts.service';
import { NetWorthController } from './net-worth.controller';
import { NetWorthSummaryService } from './net-worth-summary.service';
import { MockFipeProvider } from './vehicle-pricing/mock-fipe-provider';
import { VEHICLE_PRICING_PROVIDER } from './vehicle-pricing/vehicle-pricing-provider.interface';

@Module({
  imports: [InvestmentsModule],
  controllers: [NetWorthController],
  providers: [
    LiquidAccountsService,
    LiquidAccountsRepository,
    AssetsService,
    AssetsRepository,
    DebtsService,
    DebtsRepository,
    NetWorthSummaryService,
    { provide: VEHICLE_PRICING_PROVIDER, useClass: MockFipeProvider },
  ],
})
export class NetWorthModule {}
