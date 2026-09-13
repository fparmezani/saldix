import { Body, Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { BudgetSettingsService } from './budget-settings/budget-settings.service';
import { UpdateBudgetSettingsDto } from './budget-settings/dto/update-budget-settings.dto';
import { BudgetSummaryService } from './budget-summary.service';
import { OverviewService } from './overview.service';

@UseGuards(SupabaseAuthGuard)
@Controller('budget')
export class BudgetController {
  constructor(
    private readonly budgetSettingsService: BudgetSettingsService,
    private readonly budgetSummaryService: BudgetSummaryService,
    private readonly overviewService: OverviewService,
  ) {}

  @Get('settings')
  getSettings(@Req() req: AuthenticatedRequest, @Query('month') month: string) {
    return this.budgetSettingsService.getForMonth(req.user.id, month);
  }

  @Put('settings')
  updateSettings(@Req() req: AuthenticatedRequest, @Body() dto: UpdateBudgetSettingsDto) {
    return this.budgetSettingsService.upsert(req.user.id, dto);
  }

  @Get('summary')
  getSummary(@Req() req: AuthenticatedRequest, @Query('month') month: string) {
    return this.budgetSummaryService.calculate(req.user.id, month);
  }

  @Get('overview')
  getOverview(@Req() req: AuthenticatedRequest, @Query('months') months: string) {
    return this.overviewService.getSeries(req.user.id, Number(months) || 3);
  }
}
