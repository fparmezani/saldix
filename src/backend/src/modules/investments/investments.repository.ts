import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { Investment, InvestmentCategory, isShareBasedCategory } from './entities/investment.entity';

interface InvestmentRow {
  id: string;
  user_id: string;
  name: string;
  category: InvestmentCategory;
  invested_amount: number;
  current_amount: number;
  ticker: string | null;
  quantity: number | null;
  market_price_per_unit: number | null;
  target_percentage: number | null;
  created_at: string;
}

function toEntity(row: InvestmentRow): Investment {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    category: row.category,
    investedAmount: Number(row.invested_amount),
    currentAmount: Number(row.current_amount),
    ticker: row.ticker,
    quantity: row.quantity !== null ? Number(row.quantity) : null,
    marketPricePerUnit: row.market_price_per_unit !== null ? Number(row.market_price_per_unit) : null,
    targetPercentage: row.target_percentage !== null ? Number(row.target_percentage) : null,
    createdAt: row.created_at,
  };
}

@Injectable()
export class InvestmentsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('investments');
  }

  async findAllByUser(userId: string): Promise<Investment[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async create(userId: string, dto: CreateInvestmentDto): Promise<Investment> {
    const shareBased = isShareBasedCategory(dto.category);
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        name: dto.name,
        category: dto.category,
        invested_amount: dto.investedAmount,
        current_amount: dto.currentAmount,
        ticker: shareBased ? (dto.ticker ?? null) : null,
        quantity: shareBased ? (dto.quantity ?? null) : null,
        market_price_per_unit: shareBased ? (dto.marketPricePerUnit ?? null) : null,
        target_percentage: shareBased ? (dto.targetPercentage ?? null) : null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(userId: string, id: string, dto: UpdateInvestmentDto): Promise<Investment> {
    const { data, error } = await this.table
      .update({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.investedAmount !== undefined ? { invested_amount: dto.investedAmount } : {}),
        ...(dto.currentAmount !== undefined ? { current_amount: dto.currentAmount } : {}),
        ...(dto.ticker !== undefined ? { ticker: dto.ticker } : {}),
        ...(dto.quantity !== undefined ? { quantity: dto.quantity } : {}),
        ...(dto.marketPricePerUnit !== undefined ? { market_price_per_unit: dto.marketPricePerUnit } : {}),
        ...(dto.targetPercentage !== undefined ? { target_percentage: dto.targetPercentage } : {}),
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
