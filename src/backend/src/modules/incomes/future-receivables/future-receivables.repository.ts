import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateFutureReceivableDto } from './dto/create-future-receivable.dto';
import { FutureReceivable } from './future-receivable.entity';

interface FutureReceivableRow {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  expected_date: string;
  status: 'pending' | 'received';
  received_at: string | null;
  income_type: 'main' | 'extra';
  created_at: string;
}

function toEntity(row: FutureReceivableRow): FutureReceivable {
  return {
    id: row.id,
    userId: row.user_id,
    description: row.description,
    amount: Number(row.amount),
    expectedDate: row.expected_date,
    status: row.status,
    receivedAt: row.received_at,
    incomeType: row.income_type,
    createdAt: row.created_at,
  };
}

@Injectable()
export class FutureReceivablesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('future_receivables');
  }

  async findByMonth(userId: string, referenceMonth: string): Promise<FutureReceivable[]> {
    const start = referenceMonth;
    const end = nextMonth(referenceMonth);

    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .gte('expected_date', start)
      .lt('expected_date', end)
      .order('expected_date', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async findById(userId: string, id: string): Promise<FutureReceivable | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async create(userId: string, dto: CreateFutureReceivableDto): Promise<FutureReceivable> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        description: dto.description,
        amount: dto.amount,
        expected_date: dto.expectedDate,
        income_type: dto.incomeType,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async markAsReceived(userId: string, id: string, receivedAt: string): Promise<FutureReceivable> {
    const { data, error } = await this.table
      .update({ status: 'received', received_at: receivedAt })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async reschedule(userId: string, id: string, newExpectedDate: string): Promise<FutureReceivable> {
    const { data, error } = await this.table
      .update({ expected_date: newExpectedDate })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}

function nextMonth(referenceMonth: string): string {
  const [year, month] = referenceMonth.split('-').map(Number);
  const date = new Date(Date.UTC(year, month, 1));
  return date.toISOString().slice(0, 10);
}
