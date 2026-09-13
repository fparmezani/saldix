import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { summarizeInvestmentsByCategory } from './investment-allocation.calculator';
import { calculateGain, summarizeInvestments } from './investment-gain.calculator';
import { InvestmentsRepository } from './investments.repository';

@Injectable()
export class InvestmentsService {
  constructor(private readonly investmentsRepository: InvestmentsRepository) {}

  async listAll(userId: string) {
    const investments = await this.investmentsRepository.findAllByUser(userId);
    return investments.map((investment) => ({
      ...investment,
      ...calculateGain(investment.investedAmount, investment.currentAmount),
    }));
  }

  async getSummary(userId: string) {
    const investments = await this.investmentsRepository.findAllByUser(userId);
    return {
      ...summarizeInvestments(investments),
      byCategory: summarizeInvestmentsByCategory(investments),
    };
  }

  async create(userId: string, dto: CreateInvestmentDto) {
    return this.investmentsRepository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateInvestmentDto) {
    try {
      return await this.investmentsRepository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Investment not found');
    }
  }

  async remove(userId: string, id: string) {
    await this.investmentsRepository.delete(userId, id);
  }
}
