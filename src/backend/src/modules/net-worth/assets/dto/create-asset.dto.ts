import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AssetType } from '../entities/asset.entity';

export class CreateAssetDto {
  @IsIn(['real_estate', 'vehicle', 'other'])
  assetType!: AssetType;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  currentValue!: number;

  @IsOptional()
  @IsString()
  fipeCode?: string;
}
