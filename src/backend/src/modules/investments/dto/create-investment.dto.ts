import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min, ValidateIf } from 'class-validator';
import { InvestmentCategory, isShareBasedCategory } from '../entities/investment.entity';

function appliesToShareFields(dto: { category?: InvestmentCategory }): boolean {
  return dto.category === undefined || isShareBasedCategory(dto.category);
}

export class CreateInvestmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(['renda_fixa', 'fiis', 'acoes', 'cripto', 'outros'])
  category!: InvestmentCategory;

  @IsNumber()
  @Min(0)
  investedAmount!: number;

  @IsNumber()
  @Min(0)
  currentAmount!: number;

  @ValidateIf(appliesToShareFields)
  @IsString()
  @IsNotEmpty()
  ticker?: string;

  @ValidateIf(appliesToShareFields)
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @ValidateIf(appliesToShareFields)
  @IsNumber()
  @IsPositive()
  marketPricePerUnit?: number;

  @IsOptional()
  @ValidateIf(appliesToShareFields)
  @IsNumber()
  @Min(0)
  @Max(100)
  targetPercentage?: number;
}
