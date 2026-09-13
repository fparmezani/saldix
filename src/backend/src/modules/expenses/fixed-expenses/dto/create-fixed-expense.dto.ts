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

export class CreateFixedExpenseDto {
  @IsUUID()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsInt()
  @Min(1)
  @Max(31)
  dueDay!: number;

  @Matches(/^\d{4}-\d{2}-01$/, { message: 'referenceMonth must be in YYYY-MM-01 format' })
  referenceMonth!: string;

  @IsOptional()
  @IsUUID()
  cardId?: string;

  @IsOptional()
  @IsUUID()
  bankAccountId?: string;
}
