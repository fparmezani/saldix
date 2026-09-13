import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { GoalContributionsService } from './contributions/goal-contributions.service';
import { CreateGoalContributionDto } from './contributions/dto/create-goal-contribution.dto';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

@UseGuards(SupabaseAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly contributionsService: GoalContributionsService,
  ) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.goalsService.getAllWithStatus(req.user.id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.goalsService.remove(req.user.id, id);
  }

  @Get(':id/contributions')
  listContributions(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.contributionsService.listByGoal(req.user.id, id);
  }

  @Post(':id/contributions')
  createContribution(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: CreateGoalContributionDto,
  ) {
    return this.contributionsService.create(req.user.id, id, dto);
  }
}
