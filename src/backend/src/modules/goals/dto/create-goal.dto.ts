import { IsNotEmpty, IsNumber, IsPositive, IsString, Matches } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @IsPositive()
  targetAmount!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'targetDate must be in YYYY-MM-DD format' })
  targetDate!: string;
}
