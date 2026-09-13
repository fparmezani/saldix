import { Test } from '@nestjs/testing';
import { Income } from './entities/income.entity';
import { IncomeSchedulesService } from './income-schedules/income-schedules.service';
import { IncomesRepository } from './incomes.repository';
import { IncomesService } from './incomes.service';

function buildIncome(overrides: Partial<Income>): Income {
  return {
    id: 'id',
    userId: 'user-1',
    type: 'main',
    description: 'desc',
    amount: 0,
    referenceMonth: '2026-09-01',
    futureReceivableId: null,
    incomeScheduleId: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('IncomesService', () => {
  let service: IncomesService;
  let incomesRepository: {
    findByMonth: jest.Mock;
    findById: jest.Mock;
    delete: jest.Mock;
  };
  let incomeSchedulesService: { ensureGeneratedForMonth: jest.Mock; isActive: jest.Mock };

  beforeEach(async () => {
    incomesRepository = {
      findByMonth: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    incomeSchedulesService = {
      ensureGeneratedForMonth: jest.fn().mockResolvedValue(undefined),
      isActive: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        IncomesService,
        { provide: IncomesRepository, useValue: incomesRepository },
        { provide: IncomeSchedulesService, useValue: incomeSchedulesService },
      ],
    }).compile();

    service = moduleRef.get(IncomesService);
  });

  it('returns 100% for a single income type', () => {
    const result = service.buildBreakdown([buildIncome({ type: 'main', amount: 5000 })]);

    expect(result.totalAmount).toBe(5000);
    expect(result.percentageByType).toEqual({ main: 100 });
  });

  it('splits percentages across main and extra income', () => {
    const result = service.buildBreakdown([
      buildIncome({ type: 'main', amount: 5000 }),
      buildIncome({ type: 'extra', amount: 350 }),
    ]);

    expect(result.totalAmount).toBe(5350);
    expect(result.percentageByType.main).toBe(93);
    expect(result.percentageByType.extra).toBe(7);
  });

  it('returns zero totals and empty percentages for no incomes', () => {
    const result = service.buildBreakdown([]);

    expect(result.totalAmount).toBe(0);
    expect(result.percentageByType).toEqual({});
  });

  describe('remove', () => {
    it('deletes a plain income with no linked schedule', async () => {
      incomesRepository.findById.mockResolvedValue(buildIncome({ incomeScheduleId: null }));

      await service.remove('user-1', 'id');

      expect(incomesRepository.delete).toHaveBeenCalledWith('user-1', 'id');
    });

    it('blocks deletion when the linked schedule is still active', async () => {
      incomesRepository.findById.mockResolvedValue(
        buildIncome({ incomeScheduleId: 'sched-1' }),
      );
      incomeSchedulesService.isActive.mockResolvedValue(true);

      await expect(service.remove('user-1', 'id')).rejects.toThrow(
        'Esta receita é gerada por uma renda recorrente ativa. Desative a renda recorrente antes de excluir esta ocorrência.',
      );
      expect(incomesRepository.delete).not.toHaveBeenCalled();
    });

    it('allows deletion once the linked schedule has been deactivated', async () => {
      incomesRepository.findById.mockResolvedValue(
        buildIncome({ incomeScheduleId: 'sched-1' }),
      );
      incomeSchedulesService.isActive.mockResolvedValue(false);

      await service.remove('user-1', 'id');

      expect(incomesRepository.delete).toHaveBeenCalledWith('user-1', 'id');
    });
  });
});
