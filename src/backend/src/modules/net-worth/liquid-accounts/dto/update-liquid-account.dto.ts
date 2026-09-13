import { PartialType } from '@nestjs/mapped-types';
import { CreateLiquidAccountDto } from './create-liquid-account.dto';

export class UpdateLiquidAccountDto extends PartialType(CreateLiquidAccountDto) {}
