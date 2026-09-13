import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateIncomeScheduleDto } from './dto/create-income-schedule.dto';
import { UpdateIncomeScheduleDto } from './dto/update-income-schedule.dto';
import { IncomeSchedule } from './income-schedule.entity';

interface IncomeScheduleRow {
  id: string;
  user_id: string;
  type: 'main' | 'extra';
  description: string;
  amount: number;
  recurrence_day: number;
  active: boolean;
  created_at: string;
}

function toEntity(row: IncomeScheduleRow): IncomeSchedule {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    description: row.description,
    amount: Number(row.amount),
    recurrenceDay: row.recurrence_day,
    active: row.active,
    createdAt: row.created_at,
  };
}

@Injectable()
export class IncomeSchedulesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('income_schedules');
  }

  async findAllByUser(userId: string): Promise<IncomeSchedule[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async findById(userId: string, id: string): Promise<IncomeSchedule | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async findActiveByUser(userId: string): Promise<IncomeSchedule[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async create(userId: string, dto: CreateIncomeScheduleDto): Promise<IncomeSchedule> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        type: dto.type,
        description: dto.description,
        amount: dto.amount,
        recurrence_day: dto.recurrenceDay,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(userId: string, id: string, dto: UpdateIncomeScheduleDto): Promise<IncomeSchedule> {
    const { data, error } = await this.table
      .update({
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.recurrenceDay !== undefined ? { recurrence_day: dto.recurrenceDay } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}
