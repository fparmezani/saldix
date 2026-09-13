import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal, GoalStatusValue } from './entities/goal.entity';

interface GoalRow {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  target_date: string;
  status: GoalStatusValue;
  created_at: string;
}

function toEntity(row: GoalRow): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    targetAmount: Number(row.target_amount),
    targetDate: row.target_date,
    status: row.status,
    createdAt: row.created_at,
  };
}

@Injectable()
export class GoalsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('goals');
  }

  async findAllByUser(userId: string): Promise<Goal[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('target_date', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async findById(userId: string, id: string): Promise<Goal | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async create(userId: string, dto: CreateGoalDto): Promise<Goal> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        name: dto.name,
        target_amount: dto.targetAmount,
        target_date: dto.targetDate,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(userId: string, id: string, dto: UpdateGoalDto): Promise<Goal> {
    const { data, error } = await this.table
      .update({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.targetAmount !== undefined ? { target_amount: dto.targetAmount } : {}),
        ...(dto.targetDate !== undefined ? { target_date: dto.targetDate } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async updateStatus(userId: string, id: string, status: GoalStatusValue): Promise<Goal> {
    const { data, error } = await this.table
      .update({ status, updated_at: new Date().toISOString() })
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
