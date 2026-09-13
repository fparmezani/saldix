import { IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';

export class CreateEmergencyFundContributionDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'contributedAt must be in YYYY-MM-DD format' })
  contributedAt!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
