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
import { AuthenticatedRequest, SupabaseAuthGuard } from '../../../shared/guards/supabase-auth.guard';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { FixedExpensesService } from './fixed-expenses.service';

@UseGuards(SupabaseAuthGuard)
@Controller('expenses/fixed')
export class FixedExpensesController {
  constructor(private readonly fixedExpensesService: FixedExpensesService) {}

  @Get()
  list(@Req() req: AuthenticatedRequest, @Query('month') month: string) {
    return this.fixedExpensesService.listByMonth(req.user.id, month);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateFixedExpenseDto) {
    return this.fixedExpensesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateFixedExpenseDto,
  ) {
    return this.fixedExpensesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.fixedExpensesService.remove(req.user.id, id);
  }
}
