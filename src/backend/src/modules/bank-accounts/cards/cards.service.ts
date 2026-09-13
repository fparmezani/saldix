import { Injectable } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { CreateCardDto } from './dto/create-card.dto';
import { CardBrand } from './entities/card.entity';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async listByBankAccount(userId: string, bankAccountId: string) {
    return this.cardsRepository.findAllByBankAccount(userId, bankAccountId);
  }

  async create(userId: string, bankAccountId: string, dto: CreateCardDto) {
    return this.cardsRepository.create(userId, bankAccountId, {
      name: dto.name,
      lastDigits: dto.lastDigits,
      brand: dto.brand,
    });
  }

  async createFromDetection(
    userId: string,
    bankAccountId: string,
    record: { name: string; lastDigits?: string | null; brand?: CardBrand },
  ) {
    return this.cardsRepository.create(userId, bankAccountId, {
      name: record.name,
      lastDigits: record.lastDigits,
      brand: record.brand ?? 'other',
    });
  }

  async findByLastDigits(userId: string, bankAccountId: string, lastDigits: string) {
    return this.cardsRepository.findByLastDigits(userId, bankAccountId, lastDigits);
  }
}
