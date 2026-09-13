import { IsIn, IsNotEmpty, IsNumber, IsPositive, IsString, Matches } from 'class-validator';
import { IncomeType } from '../entities/income.entity';

export class CreateIncomeDto {
  @IsIn(['main', 'extra'])
  type!: IncomeType;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @Matches(/^\d{4}-\d{2}-01$/, {
    message: 'referenceMonth must be in YYYY-MM-01 format',
  })
  referenceMonth!: string;
}
