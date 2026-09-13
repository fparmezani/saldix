import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';

interface IncomeRow {
  id: string;
  user_id: string;
  type: 'main' | 'extra';
  description: string;
  amount: number;
  reference_month: string;
  future_receivable_id: string | null;
  income_schedule_id: string | null;
  created_at: string;
}

function toEntity(row: IncomeRow): Income {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    description: row.description,
    amount: Number(row.amount),
    referenceMonth: row.reference_month,
    futureReceivableId: row.future_receivable_id,
    incomeScheduleId: row.income_schedule_id,
    createdAt: row.created_at,
  };
}

@Injectable()
export class IncomesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('incomes');
  }

  async findByMonth(userId: string, referenceMonth: string): Promise<Income[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .eq('reference_month', referenceMonth)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async create(
    userId: string,
    dto: CreateIncomeDto,
    futureReceivableId: string | null = null,
    incomeScheduleId: string | null = null,
  ): Promise<Income> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        type: dto.type,
        description: dto.description,
        amount: dto.amount,
        reference_month: dto.referenceMonth,
        future_receivable_id: futureReceivableId,
        income_schedule_id: incomeScheduleId,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async findById(userId: string, id: string): Promise<Income | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async existsForScheduleAndMonth(
    userId: string,
    incomeScheduleId: string,
    referenceMonth: string,
  ): Promise<boolean> {
    const { data, error } = await this.table
      .select('id')
      .eq('user_id', userId)
      .eq('income_schedule_id', incomeScheduleId)
      .eq('reference_month', referenceMonth)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  }

  async update(userId: string, id: string, dto: UpdateIncomeDto): Promise<Income> {
    const { data, error } = await this.table
      .update({
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.referenceMonth !== undefined ? { reference_month: dto.referenceMonth } : {}),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async delete(userId: string, id: string): Promise<void> {
    const { error } = await this.table.delete().eq('id', id).eq('user_id', userId);
    if (error) throw error;
  }
}
