import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

interface CategoryRow {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

function toEntity(row: CategoryRow): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
  };
}

@Injectable()
export class CategoriesRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('categories');
  }

  async findAllByUser(userId: string): Promise<Category[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async create(userId: string, dto: CreateCategoryDto): Promise<Category> {
    const { data, error } = await this.table
      .insert({ user_id: userId, name: dto.name, color: dto.color })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto): Promise<Category> {
    const { data, error } = await this.table
      .update({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
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

  async isReferencedByExpenses(userId: string, categoryId: string): Promise<boolean> {
    const client = this.supabaseService.getClient();

    const [fixed, variable] = await Promise.all([
      client
        .from('fixed_expenses')
        .select('id')
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .limit(1),
      client
        .from('variable_expenses')
        .select('id')
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .limit(1),
    ]);

    if (fixed.error) throw fixed.error;
    if (variable.error) throw variable.error;

    return (fixed.data?.length ?? 0) > 0 || (variable.data?.length ?? 0) > 0;
  }
}
