import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { Card, CardBrand } from './entities/card.entity';

interface CardRow {
  id: string;
  user_id: string;
  bank_account_id: string;
  name: string;
  last_digits: string | null;
  brand: CardBrand;
  created_at: string;
}

function toEntity(row: CardRow): Card {
  return {
    id: row.id,
    userId: row.user_id,
    bankAccountId: row.bank_account_id,
    name: row.name,
    lastDigits: row.last_digits,
    brand: row.brand,
    createdAt: row.created_at,
  };
}

@Injectable()
export class CardsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('cards');
  }

  async findAllByUser(userId: string): Promise<Card[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async findAllByBankAccount(userId: string, bankAccountId: string): Promise<Card[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .eq('bank_account_id', bankAccountId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async findByLastDigits(
    userId: string,
    bankAccountId: string,
    lastDigits: string,
  ): Promise<Card | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .eq('bank_account_id', bankAccountId)
      .eq('last_digits', lastDigits)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async create(
    userId: string,
    bankAccountId: string,
    record: { name: string; lastDigits?: string | null; brand: CardBrand },
  ): Promise<Card> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        bank_account_id: bankAccountId,
        name: record.name,
        last_digits: record.lastDigits ?? null,
        brand: record.brand,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}
