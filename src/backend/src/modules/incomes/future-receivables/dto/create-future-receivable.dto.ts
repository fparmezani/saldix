import { IsIn, IsNotEmpty, IsNumber, IsPositive, IsString, Matches } from 'class-validator';
import { IncomeType } from '../../entities/income.entity';

export class CreateFutureReceivableDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'expectedDate must be in YYYY-MM-DD format' })
  expectedDate!: string;

  @IsIn(['main', 'extra'])
  incomeType!: IncomeType;
}
