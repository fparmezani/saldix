import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { DebtsRepository } from './debts.repository';

@Injectable()
export class DebtsService {
  constructor(private readonly repository: DebtsRepository) {}

  async listAll(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async total(userId: string): Promise<number> {
    return this.repository.sumByUser(userId);
  }

  async create(userId: string, dto: CreateDebtDto) {
    return this.repository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateDebtDto) {
    try {
      return await this.repository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Debt not found');
    }
  }

  async remove(userId: string, id: string) {
    await this.repository.delete(userId, id);
  }
}
