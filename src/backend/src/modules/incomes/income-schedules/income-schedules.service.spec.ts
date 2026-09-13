import { Test } from '@nestjs/testing';
import { IncomesRepository } from '../incomes.repository';
import { IncomeSchedule } from './income-schedule.entity';
import { IncomeSchedulesRepository } from './income-schedules.repository';
import { IncomeSchedulesService } from './income-schedules.service';

function buildSchedule(overrides: Partial<IncomeSchedule>): IncomeSchedule {
  return {
    id: 'sched-1',
    userId: 'user-1',
    type: 'main',
    description: 'Salário',
    amount: 1200,
    recurrenceDay: 5,
    active: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('IncomeSchedulesService', () => {
  let service: IncomeSchedulesService;
  let incomesRepository: { existsForScheduleAndMonth: jest.Mock; create: jest.Mock };
  let incomeSchedulesRepository: { findActiveByUser: jest.Mock };

  beforeEach(async () => {
    incomesRepository = {
      existsForScheduleAndMonth: jest.fn(),
      create: jest.fn(),
    };
    incomeSchedulesRepository = {
      findActiveByUser: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        IncomeSchedulesService,
        { provide: IncomeSchedulesRepository, useValue: incomeSchedulesRepository },
        { provide: IncomesRepository, useValue: incomesRepository },
      ],
    }).compile();

    service = moduleRef.get(IncomeSchedulesService);
  });

  it('generates an occurrence when none exists yet for the month', async () => {
    incomeSchedulesRepository.findActiveByUser.mockResolvedValue([buildSchedule({})]);
    incomesRepository.existsForScheduleAndMonth.mockResolvedValue(false);

    await service.ensureGeneratedForMonth('user-1', '2026-10-01');

    expect(incomesRepository.create).toHaveBeenCalledWith(
      'user-1',
      { type: 'main', description: 'Salário', amount: 1200, referenceMonth: '2026-10-01' },
      null,
      'sched-1',
    );
  });

  it('does not duplicate an occurrence already generated for the month', async () => {
    incomeSchedulesRepository.findActiveByUser.mockResolvedValue([buildSchedule({})]);
    incomesRepository.existsForScheduleAndMonth.mockResolvedValue(true);

    await service.ensureGeneratedForMonth('user-1', '2026-10-01');

    expect(incomesRepository.create).not.toHaveBeenCalled();
  });

  it('skips inactive schedules entirely', async () => {
    incomeSchedulesRepository.findActiveByUser.mockResolvedValue([]);

    await service.ensureGeneratedForMonth('user-1', '2026-10-01');

    expect(incomesRepository.existsForScheduleAndMonth).not.toHaveBeenCalled();
    expect(incomesRepository.create).not.toHaveBeenCalled();
  });
});
