import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { BankAccountType } from '../entities/bank-account.entity';

export class CreateBankAccountDto {
  @IsIn(['checking', 'investment'])
  type!: BankAccountType;

  @IsString()
  @IsNotEmpty()
  bankCode!: string;

  @IsString()
  @IsNotEmpty()
  agency!: string;

  @IsString()
  @IsNotEmpty()
  accountNumber!: string;
}
