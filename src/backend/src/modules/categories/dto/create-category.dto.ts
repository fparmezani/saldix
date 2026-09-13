import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Matches(/^#[0-9a-fA-F]{6}$/, { message: 'color must be a hex color like #7C3AED' })
  color!: string;
}
