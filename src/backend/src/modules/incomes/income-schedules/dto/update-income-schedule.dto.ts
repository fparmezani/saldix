import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class UpdateIncomeScheduleDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  recurrenceDay?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
