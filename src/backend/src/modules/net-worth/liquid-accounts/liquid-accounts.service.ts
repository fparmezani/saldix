import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLiquidAccountDto } from './dto/create-liquid-account.dto';
import { UpdateLiquidAccountDto } from './dto/update-liquid-account.dto';
import { LiquidAccountsRepository } from './liquid-accounts.repository';

@Injectable()
export class LiquidAccountsService {
  constructor(private readonly repository: LiquidAccountsRepository) {}

  async listAll(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async total(userId: string): Promise<number> {
    return this.repository.sumByUser(userId);
  }

  async create(userId: string, dto: CreateLiquidAccountDto) {
    return this.repository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateLiquidAccountDto) {
    try {
      return await this.repository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Liquid account not found');
    }
  }

  async remove(userId: string, id: string) {
    await this.repository.delete(userId, id);
  }
}
