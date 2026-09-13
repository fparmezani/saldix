import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { UpdateBudgetSettingsDto } from './dto/update-budget-settings.dto';
import { BudgetSettings } from './entities/budget-settings.entity';

interface BudgetSettingsRow {
  reference_month: string;
  invest_mode: 'percentage' | 'fixed';
  invest_percentage: number | null;
  invest_fixed_amount: number | null;
}

function toEntity(row: BudgetSettingsRow): BudgetSettings {
  return {
    referenceMonth: row.reference_month,
    investMode: row.invest_mode,
    investPercentage: row.invest_percentage !== null ? Number(row.invest_percentage) : null,
    investFixedAmount:
      row.invest_fixed_amount !== null ? Number(row.invest_fixed_amount) : null,
  };
}

@Injectable()
export class BudgetSettingsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('budget_settings');
  }

  async findByMonth(userId: string, referenceMonth: string): Promise<BudgetSettings | null> {
    const { data, error } = await this.table
      .select('reference_month, invest_mode, invest_percentage, invest_fixed_amount')
      .eq('user_id', userId)
      .eq('reference_month', referenceMonth)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async upsert(userId: string, dto: UpdateBudgetSettingsDto): Promise<BudgetSettings> {
    const { data, error } = await this.table
      .upsert(
        {
          user_id: userId,
          reference_month: dto.referenceMonth,
          invest_mode: dto.investMode,
          invest_percentage: dto.investMode === 'percentage' ? dto.investPercentage : null,
          invest_fixed_amount: dto.investMode === 'fixed' ? dto.investFixedAmount : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,reference_month' },
      )
      .select('reference_month, invest_mode, invest_percentage, invest_fixed_amount')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}
