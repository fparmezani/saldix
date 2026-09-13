import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateFutureReceivableDto } from './dto/create-future-receivable.dto';
import { RescheduleFutureReceivableDto } from './dto/reschedule-future-receivable.dto';
import { buildIncomeFromReceivable } from './future-receivables.factory';
import { FutureReceivablesRepository } from './future-receivables.repository';
import { IncomesService } from '../incomes.service';

@Injectable()
export class FutureReceivablesService {
  constructor(
    private readonly futureReceivablesRepository: FutureReceivablesRepository,
    private readonly incomesService: IncomesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async listByMonth(userId: string, referenceMonth: string) {
    return this.futureReceivablesRepository.findByMonth(userId, referenceMonth);
  }

  async create(userId: string, dto: CreateFutureReceivableDto) {
    const today = new Date().toISOString().slice(0, 10);
    if (dto.expectedDate < today) {
      throw new BadRequestException('expectedDate must be today or in the future');
    }
    return this.futureReceivablesRepository.create(userId, dto);
  }

  async confirm(userId: string, id: string) {
    const receivable = await this.futureReceivablesRepository.findById(userId, id);
    if (!receivable) {
      throw new NotFoundException('Future receivable not found');
    }
    if (receivable.status === 'received') {
      throw new BadRequestException('Future receivable already confirmed');
    }

    const receivedAt = new Date().toISOString();
    const confirmed = await this.futureReceivablesRepository.markAsReceived(
      userId,
      id,
      receivedAt,
    );

    const incomeDto = buildIncomeFromReceivable(confirmed);
    const income = await this.incomesService.create(userId, incomeDto, confirmed.id);

    this.eventEmitter.emit('future-receivable.confirmed', { receivable: confirmed, income });

    return confirmed;
  }

  async reschedule(userId: string, id: string, dto: RescheduleFutureReceivableDto) {
    const receivable = await this.futureReceivablesRepository.findById(userId, id);
    if (!receivable) {
      throw new NotFoundException('Future receivable not found');
    }
    if (receivable.status === 'received') {
      throw new BadRequestException('Cannot reschedule a receivable already confirmed');
    }

    return this.futureReceivablesRepository.reschedule(userId, id, dto.newExpectedDate);
  }
}
