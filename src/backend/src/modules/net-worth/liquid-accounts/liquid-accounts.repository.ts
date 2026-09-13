import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateLiquidAccountDto } from './dto/create-liquid-account.dto';
import { UpdateLiquidAccountDto } from './dto/update-liquid-account.dto';
import { LiquidAccount } from './entities/liquid-account.entity';

interface LiquidAccountRow {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  created_at: string;
}

function toEntity(row: LiquidAccountRow): LiquidAccount {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    amount: Number(row.amount),
    createdAt: row.created_at,
  };
}

@Injectable()
export class LiquidAccountsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('liquid_accounts');
  }

  async findAllByUser(userId: string): Promise<LiquidAccount[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async sumByUser(userId: string): Promise<number> {
    const { data, error } = await this.table.select('amount').eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
  }

  async create(userId: string, dto: CreateLiquidAccountDto): Promise<LiquidAccount> {
    const { data, error } = await this.table
      .insert({ user_id: userId, name: dto.name, amount: dto.amount })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateLiquidAccountDto,
  ): Promise<LiquidAccount> {
    const { data, error } = await this.table
      .update({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
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
