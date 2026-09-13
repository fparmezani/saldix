import { Injectable } from '@nestjs/common';
import { InvestmentsService } from '../investments/investments.service';
import { AssetsService } from './assets/assets.service';
import { DebtsService } from './debts/debts.service';
import { LiquidAccountsService } from './liquid-accounts/liquid-accounts.service';
import { calculateNetWorth } from './net-worth-summary.calculator';

@Injectable()
export class NetWorthSummaryService {
  constructor(
    private readonly liquidAccountsService: LiquidAccountsService,
    private readonly investmentsService: InvestmentsService,
    private readonly assetsService: AssetsService,
    private readonly debtsService: DebtsService,
  ) {}

  async getSummary(userId: string) {
    const [totalLiquidity, investmentsSummary, totalAssets, totalDebts] = await Promise.all([
      this.liquidAccountsService.total(userId),
      this.investmentsService.getSummary(userId),
      this.assetsService.total(userId),
      this.debtsService.total(userId),
    ]);

    return calculateNetWorth({
      totalLiquidity,
      totalInvestments: investmentsSummary.totalCurrent,
      totalAssets,
      totalDebts,
    });
  }
}
