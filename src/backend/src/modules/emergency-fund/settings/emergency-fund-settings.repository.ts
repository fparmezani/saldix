import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { UpdateEmergencyFundSettingsDto } from './dto/update-emergency-fund-settings.dto';
import { EmergencyFundSettings } from './entities/emergency-fund-settings.entity';

interface EmergencyFundSettingsRow {
  protection_type: 'basic' | 'shielded';
  monthly_essential_cost: number;
}

function toEntity(row: EmergencyFundSettingsRow): EmergencyFundSettings {
  return {
    protectionType: row.protection_type,
    monthlyEssentialCost: Number(row.monthly_essential_cost),
  };
}

@Injectable()
export class EmergencyFundSettingsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('emergency_fund_settings');
  }

  async find(userId: string): Promise<EmergencyFundSettings | null> {
    const { data, error } = await this.table
      .select('protection_type, monthly_essential_cost')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async upsert(
    userId: string,
    dto: UpdateEmergencyFundSettingsDto,
  ): Promise<EmergencyFundSettings> {
    const { data, error } = await this.table
      .upsert(
        {
          user_id: userId,
          protection_type: dto.protectionType,
          monthly_essential_cost: dto.monthlyEssentialCost,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      .select('protection_type, monthly_essential_cost')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}
