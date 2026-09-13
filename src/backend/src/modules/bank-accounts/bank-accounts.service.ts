import { Injectable, NotFoundException } from '@nestjs/common';
import { lookupBankName } from './bank-lookup/bank-code-directory';
import { BankAccountsRepository } from './bank-accounts.repository';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(private readonly bankAccountsRepository: BankAccountsRepository) {}

  async listAll(userId: string) {
    return this.bankAccountsRepository.findAllByUser(userId);
  }

  async create(userId: string, dto: CreateBankAccountDto) {
    return this.bankAccountsRepository.create(userId, {
      type: dto.type,
      bankCode: dto.bankCode,
      bankName: lookupBankName(dto.bankCode),
      agency: dto.agency,
      accountNumber: dto.accountNumber,
    });
  }

  async findByIdOrFail(userId: string, id: string) {
    const account = await this.bankAccountsRepository.findById(userId, id);
    if (!account) {
      throw new NotFoundException('Bank account not found');
    }
    return account;
  }
}
