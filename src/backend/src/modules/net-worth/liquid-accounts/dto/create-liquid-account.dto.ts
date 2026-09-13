import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateLiquidAccountDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  amount!: number;
}
