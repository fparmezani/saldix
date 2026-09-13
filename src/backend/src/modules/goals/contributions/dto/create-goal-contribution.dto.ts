import { IsNumber, IsPositive, Matches } from 'class-validator';

export class CreateGoalContributionDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'contributedAt must be in YYYY-MM-DD format' })
  contributedAt!: string;
}
