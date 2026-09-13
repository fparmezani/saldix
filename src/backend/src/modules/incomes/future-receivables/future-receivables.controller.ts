import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../../shared/guards/supabase-auth.guard';
import { CreateFutureReceivableDto } from './dto/create-future-receivable.dto';
import { RescheduleFutureReceivableDto } from './dto/reschedule-future-receivable.dto';
import { FutureReceivablesService } from './future-receivables.service';

@UseGuards(SupabaseAuthGuard)
@Controller('future-receivables')
export class FutureReceivablesController {
  constructor(private readonly futureReceivablesService: FutureReceivablesService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('month') month: string) {
    return this.futureReceivablesService.listByMonth(req.user.id, month);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateFutureReceivableDto) {
    return this.futureReceivablesService.create(req.user.id, dto);
  }

  @Patch(':id/confirm')
  confirm(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.futureReceivablesService.confirm(req.user.id, id);
  }

  @Patch(':id/reschedule')
  reschedule(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: RescheduleFutureReceivableDto,
  ) {
    return this.futureReceivablesService.reschedule(req.user.id, id, dto);
  }
}
