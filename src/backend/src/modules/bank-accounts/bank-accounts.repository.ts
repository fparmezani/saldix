import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { BankAccount, BankAccountType } from './entities/bank-account.entity';

interface BankAccountRow {
  id: string;
  user_id: string;
  type: BankAccountType;
  bank_code: string;
  bank_name: string;
  agency: string;
  account_number: string;
  created_at: string;
}

function toEntity(row: BankAccountRow): BankAccount {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    bankCode: row.bank_code,
    bankName: row.bank_name,
    agency: row.agency,
    accountNumber: row.account_number,
    createdAt: row.created_at,
  };
}

@Injectable()
export class BankAccountsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('bank_accounts');
  }

  async findAllByUser(userId: string): Promise<BankAccount[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async findById(userId: string, id: string): Promise<BankAccount | null> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data ? toEntity(data) : null;
  }

  async create(
    userId: string,
    record: {
      type: BankAccountType;
      bankCode: string;
      bankName: string;
      agency: string;
      accountNumber: string;
    },
  ): Promise<BankAccount> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        type: record.type,
        bank_code: record.bankCode,
        bank_name: record.bankName,
        agency: record.agency,
        account_number: record.accountNumber,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }
}
