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
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { InvestmentsService } from './investments.service';

@UseGuards(SupabaseAuthGuard)
@Controller('investments')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.investmentsService.listAll(req.user.id);
  }

  @Get('summary')
  summary(@Req() req: AuthenticatedRequest) {
    return this.investmentsService.getSummary(req.user.id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateInvestmentDto) {
    return this.investmentsService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateInvestmentDto,
  ) {
    return this.investmentsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.investmentsService.remove(req.user.id, id);
  }
}
