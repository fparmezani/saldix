import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Matches } from 'class-validator';

export class UpdateVariableExpenseDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'expenseDate must be in YYYY-MM-DD format' })
  expenseDate?: string;

  @IsOptional()
  @IsUUID()
  cardId?: string;

  @IsOptional()
  @IsUUID()
  bankAccountId?: string;
}
