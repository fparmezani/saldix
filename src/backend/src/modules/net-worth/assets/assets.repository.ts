import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../../shared/supabase/supabase.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset, AssetType } from './entities/asset.entity';

interface AssetRow {
  id: string;
  user_id: string;
  asset_type: AssetType;
  name: string;
  current_value: number;
  fipe_code: string | null;
  created_at: string;
}

function toEntity(row: AssetRow): Asset {
  return {
    id: row.id,
    userId: row.user_id,
    assetType: row.asset_type,
    name: row.name,
    currentValue: Number(row.current_value),
    fipeCode: row.fipe_code,
    createdAt: row.created_at,
  };
}

@Injectable()
export class AssetsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get table() {
    return this.supabaseService.getClient().from('assets');
  }

  async findAllByUser(userId: string): Promise<Asset[]> {
    const { data, error } = await this.table
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(toEntity);
  }

  async sumByUser(userId: string): Promise<number> {
    const { data, error } = await this.table.select('current_value').eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + Number(row.current_value), 0);
  }

  async create(userId: string, dto: CreateAssetDto): Promise<Asset> {
    const { data, error } = await this.table
      .insert({
        user_id: userId,
        asset_type: dto.assetType,
        name: dto.name,
        current_value: dto.currentValue,
        fipe_code: dto.fipeCode ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return toEntity(data);
  }

  async update(userId: string, id: string, dto: UpdateAssetDto): Promise<Asset> {
    const { data, error } = await this.table
      .update({
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.currentValue !== undefined ? { current_value: dto.currentValue } : {}),
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
