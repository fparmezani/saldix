import { IsIn, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from 'class-validator';
import { IncomeType } from '../../entities/income.entity';

export class CreateIncomeScheduleDto {
  @IsIn(['main', 'extra'])
  type!: IncomeType;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsInt()
  @Min(1)
  @Max(31)
  recurrenceDay!: number;
}
