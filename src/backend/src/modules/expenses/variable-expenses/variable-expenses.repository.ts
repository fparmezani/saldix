import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { UpdateVariableExpenseDto } from './dto/update-variable-expense.dto';
import { VariableExpense } from './entities/variable-expense.entity';
import { InstallmentRecord } from './variable-expenses.factory';

interface VariableExpenseRow {
  id: string;
  user_id: string;
  category_id: string;
  description: string;
  amount: number;
  expense_date: string;
  installment_group_id: string | null;
  installment_number: number | null;
  installment_total: number | null;
  card_id: string | null;
  bank_account_id: string | null;
  created_at: string;
}

function toEntity(row: VariableExpenseRow): VariableExpense {
  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    description: row.description,
    amount: Number(row.amount),
    expenseDate: row.expense_date,
    installmentGroupId: row.installment_group_id,
    installmentNumber: row.installment_number,
    installmentTotal: row.installment_total,
    cardId: row.card_id,
    bankAccountId: row.bank_account_id,
    createdAt: row.created_at,
  };
}

function nextMonth(referenceMonth: string): string {
  const [year, month] = referenceMonth.split('-').map(Number);
  return new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
}

@Injectable()
export class VariableExpensesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('variable_expenses');
  }

  async findByMonth(
    userId: string,
    referenceMonth: string,
    categoryId?: string,
  ): Promise<VariableExpense[]> {
    let query = this.table
      .select('*')
      .eq('user_id', userId)
      .gte('expense_date', referenceMonth)
      .lt('expense_date', nextMonth(referenceMonth))
      .order('expense_date', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async createSingle(
    userId: string,
    record: {
      categoryId: string;
      description: string;
      amount: number;
      expenseDate: string;
      cardId?: string | null;
      bankAccountId?: string | null;
    },
  ): Promise<VariableExpense> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        category_id: record.categoryId,
        description: record.description,
        amount: record.amount,
        expense_date: record.expenseDate,
        card_id: record.cardId ?? null,
        bank_account_id: record.bankAccountId ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async createInstallments(
    userId: string,
    records: InstallmentRecord[],
  ): Promise<VariableExpense[]> {
    const { data, error } = await this.table
      .insert(
        records.map((record) => ({
          user_id: userId,
          category_id: record.categoryId,
          description: record.description,
          amount: record.amount,
          expense_date: record.expenseDate,
          installment_group_id: record.installmentGroupId,
          installment_number: record.installmentNumber,
          installment_total: record.installmentTotal,
          card_id: record.cardId ?? null,
          bank_account_id: record.bankAccountId ?? null,
        })),
      )
      .select('*');

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateVariableExpenseDto,
  ): Promise<VariableExpense> {
    const { data, error } = await this.table
      .update({
        ...(dto.categoryId !== undefined ? { category_id: dto.categoryId } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.expenseDate !== undefined ? { expense_date: dto.expenseDate } : {}),
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
