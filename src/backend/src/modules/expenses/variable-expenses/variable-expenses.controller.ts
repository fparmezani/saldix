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
import { CreateVariableExpenseDto } from './dto/create-variable-expense.dto';
import { UpdateVariableExpenseDto } from './dto/update-variable-expense.dto';
import { VariableExpensesService } from './variable-expenses.service';

@UseGuards(SupabaseAuthGuard)
@Controller('expenses/variable')
export class VariableExpensesController {
  constructor(private readonly variableExpensesService: VariableExpensesService) {}

  @Get()
  list(
    @Req() req: AuthenticatedRequest,
    @Query('month') month: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.variableExpensesService.listByMonth(req.user.id, month, categoryId);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateVariableExpenseDto) {
    return this.variableExpensesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateVariableExpenseDto,
  ) {
    return this.variableExpensesService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.variableExpensesService.remove(req.user.id, id);
  }
}
