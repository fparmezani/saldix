import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';
import { GoalContribution } from './entities/goal-contribution.entity';

interface GoalContributionRow {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  contributed_at: string;
  created_at: string;
}

function toEntity(row: GoalContributionRow): GoalContribution {
  return {
    id: row.id,
    goalId: row.goal_id,
    userId: row.user_id,
    amount: Number(row.amount),
    contributedAt: row.contributed_at,
    createdAt: row.created_at,
  };
}

@Injectable()
export class GoalContributionsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('goal_contributions');
  }

  async findByGoal(userId: string, goalId: string): Promise<GoalContribution[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .eq('goal_id', goalId)
      .order('contributed_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async sumByGoal(userId: string, goalId: string): Promise<number> {
    const { data, error } = await this.table
      .select('amount')
      .eq('user_id', userId)
      .eq('goal_id', goalId);

    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
  }

  async sumForAllGoals(userId: string): Promise<Record<string, number>> {
    const { data, error } = await this.table.select('goal_id, amount').eq('user_id', userId);
    if (error) throw error;

    return (data ?? []).reduce<Record<string, number>>((totals, row) => {
      totals[row.goal_id] = (totals[row.goal_id] ?? 0) + Number(row.amount);
      return totals;
    }, {});
  }

  async create(
    userId: string,
    goalId: string,
    dto: CreateGoalContributionDto,
  ): Promise<GoalContribution> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        goal_id: goalId,
        amount: dto.amount,
        contributed_at: dto.contributedAt,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}
