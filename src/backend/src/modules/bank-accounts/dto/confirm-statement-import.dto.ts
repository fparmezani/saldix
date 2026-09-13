import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { CardBrand } from '../cards/entities/card.entity';

class ConfirmStatementCardDto {
  @IsInt()
  @Min(0)
  cardIndex!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  lastDigits?: string;

  @IsOptional()
  @IsIn(['visa', 'mastercard', 'other'])
  brand?: CardBrand;

  @IsOptional()
  @IsUUID()
  existingCardId?: string | null;
}

class ConfirmStatementTransactionDto {
  @IsInt()
  @Min(0)
  cardIndex!: number;

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
  @Min(1)
  installmentNumber?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  installmentTotal?: number | null;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @IsBoolean()
  isRecurring!: boolean;

  @IsOptional()
  @IsUUID()
  linkToExpenseId?: string | null;

  @IsOptional()
  @IsIn(['fixed', 'variable'])
  linkToExpenseType?: 'fixed' | 'variable' | null;
}

export class ConfirmStatementImportDto {
  @IsIn(['card_invoice', 'bank_statement'])
  sourceType!: 'card_invoice' | 'bank_statement';

  @IsUUID()
  bankAccountId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfirmStatementCardDto)
  cards!: ConfirmStatementCardDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfirmStatementTransactionDto)
  transactions!: ConfirmStatementTransactionDto[];
}
