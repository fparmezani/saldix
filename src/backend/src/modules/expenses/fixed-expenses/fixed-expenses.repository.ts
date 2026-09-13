import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateFixedExpenseDto } from './dto/create-fixed-expense.dto';
import { UpdateFixedExpenseDto } from './dto/update-fixed-expense.dto';
import { FixedExpense } from './entities/fixed-expense.entity';

interface FixedExpenseRow {
  id: string;
  user_id: string;
  category_id: string;
  description: string;
  amount: number;
  due_day: number;
  reference_month: string;
  card_id: string | null;
  bank_account_id: string | null;
  created_at: string;
}

function toEntity(row: FixedExpenseRow): FixedExpense {
  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    description: row.description,
    amount: Number(row.amount),
    dueDay: row.due_day,
    referenceMonth: row.reference_month,
    cardId: row.card_id,
    bankAccountId: row.bank_account_id,
    createdAt: row.created_at,
  };
}

@Injectable()
export class FixedExpensesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('fixed_expenses');
  }

  async findByMonth(userId: string, referenceMonth: string): Promise<FixedExpense[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .eq('reference_month', referenceMonth)
      .order('due_day', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async create(userId: string, dto: CreateFixedExpenseDto): Promise<FixedExpense> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        category_id: dto.categoryId,
        description: dto.description,
        amount: dto.amount,
        due_day: dto.dueDay,
        reference_month: dto.referenceMonth,
        card_id: dto.cardId ?? null,
        bank_account_id: dto.bankAccountId ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(userId: string, id: string, dto: UpdateFixedExpenseDto): Promise<FixedExpense> {
    const { data, error } = await this.table
      .update({
        ...(dto.categoryId !== undefined ? { category_id: dto.categoryId } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.dueDay !== undefined ? { due_day: dto.dueDay } : {}),
        ...(dto.referenceMonth !== undefined ? { reference_month: dto.referenceMonth } : {}),
        ...(dto.cardId !== undefined ? { card_id: dto.cardId } : {}),
        ...(dto.bankAccountId !== undefined ? { bank_account_id: dto.bankAccountId } : {}),
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
