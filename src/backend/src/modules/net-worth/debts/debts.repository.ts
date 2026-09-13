import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Debt } from './entities/debt.entity';

interface DebtRow {
  id: string;
  user_id: string;
  asset_id: string | null;
  name: string;
  outstanding_balance: number;
  created_at: string;
}

function toEntity(row: DebtRow): Debt {
  return {
    id: row.id,
    userId: row.user_id,
    assetId: row.asset_id,
    name: row.name,
    outstandingBalance: Number(row.outstanding_balance),
    createdAt: row.created_at,
  };
}

@Injectable()
export class DebtsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('debts');
  }

  async findAllByUser(userId: string): Promise<Debt[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async sumByUser(userId: string): Promise<number> {
    const { data, error } = await this.table.select('outstanding_balance').eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + Number(row.outstanding_balance), 0);
  }

  async create(userId: string, dto: CreateDebtDto): Promise<Debt> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        asset_id: dto.assetId ?? null,
        name: dto.name,
        outstanding_balance: dto.outstandingBalance,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(userId: string, id: string, dto: UpdateDebtDto): Promise<Debt> {
    const { data, error } = await this.table
      .update({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.outstandingBalance !== undefined
          ? { outstanding_balance: dto.outstandingBalance }
          : {}),
        updated_at: new Date().toISOString(),
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
