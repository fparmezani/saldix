import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../../shared/guards/supabase-auth.guard';
import { CreateIncomeScheduleDto } from './dto/create-income-schedule.dto';
import { UpdateIncomeScheduleDto } from './dto/update-income-schedule.dto';
import { IncomeSchedulesService } from './income-schedules.service';

@UseGuards(SupabaseAuthGuard)
@Controller('income-schedules')
export class IncomeSchedulesController {
  constructor(private readonly incomeSchedulesService: IncomeSchedulesService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.incomeSchedulesService.listAll(req.user.id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateIncomeScheduleDto) {
    return this.incomeSchedulesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateIncomeScheduleDto,
  ) {
    return this.incomeSchedulesService.update(req.user.id, id, dto);
  }
}
