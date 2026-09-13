import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateVariableExpenseDto {
  @IsUUID()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'expenseDate must be in YYYY-MM-DD format' })
  expenseDate!: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(60)
  installments?: number;

  @IsOptional()
  @IsUUID()
  cardId?: string;

  @IsOptional()
  @IsUUID()
  bankAccountId?: string;
}
