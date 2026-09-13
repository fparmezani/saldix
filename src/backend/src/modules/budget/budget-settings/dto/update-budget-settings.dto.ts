import { IsIn, IsNumber, IsOptional, Matches, Max, Min } from 'class-validator';
import { InvestMode } from '../entities/budget-settings.entity';

export class UpdateBudgetSettingsDto {
  @Matches(/^\d{4}-\d{2}-01$/, { message: 'referenceMonth must be in YYYY-MM-01 format' })
  referenceMonth!: string;

  @IsIn(['percentage', 'fixed'])
  investMode!: InvestMode;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  investPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  investFixedAmount?: number;
}
