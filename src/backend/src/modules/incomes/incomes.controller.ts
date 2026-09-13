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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../shared/guards/supabase-auth.guard';
import { SupabaseAuthGuard } from '../../shared/guards/supabase-auth.guard';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomesService } from './incomes.service';

@UseGuards(SupabaseAuthGuard)
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('month') month: string) {
    return this.incomesService.listByMonth(req.user.id, month);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateIncomeDto) {
    return this.incomesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.incomesService.remove(req.user.id, id);
  }
}
