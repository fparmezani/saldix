import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateEmergencyFundContributionDto } from './dto/create-emergency-fund-contribution.dto';
import { EmergencyFundContribution } from './entities/emergency-fund-contribution.entity';

interface ContributionRow {
  id: string;
  user_id: string;
  amount: number;
  contributed_at: string;
  note: string | null;
  created_at: string;
}

function toEntity(row: ContributionRow): EmergencyFundContribution {
  return {
    id: row.id,
    userId: row.user_id,
    amount: Number(row.amount),
    contributedAt: row.contributed_at,
    note: row.note,
    createdAt: row.created_at,
  };
}

@Injectable()
export class EmergencyFundContributionsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('emergency_fund_contributions');
  }

  async findAllByUser(userId: string): Promise<EmergencyFundContribution[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('contributed_at', { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async sumByUser(userId: string): Promise<number> {
    const { data, error } = await this.table.select('amount').eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
  }

  async create(
    userId: string,
    dto: CreateEmergencyFundContributionDto,
  ): Promise<EmergencyFundContribution> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        amount: dto.amount,
        contributed_at: dto.contributedAt,
        note: dto.note ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}
