import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CardBrand } from '../entities/card.entity';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  lastDigits?: string;

  @IsIn(['visa', 'mastercard', 'other'])
  brand!: CardBrand;
}
