import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Goal } from '../entities/goal.entity';
import { GoalsRepository } from '../goals.repository';
import { GoalContributionsRepository } from './goal-contributions.repository';
import { GoalContributionsService } from './goal-contributions.service';

function buildGoal(overrides: Partial<Goal>): Goal {
  return {
    id: 'goal-1',
    userId: 'user-1',
    name: 'Viagem',
    targetAmount: 25000,
    targetDate: '2028-09-06',
    status: 'active',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('GoalContributionsService', () => {
  let service: GoalContributionsService;
  let contributionsRepository: {
    create: jest.Mock;
    sumByGoal: jest.Mock;
  };
  let goalsRepository: { findById: jest.Mock; updateStatus: jest.Mock };
  let eventEmitter: { emit: jest.Mock };

  beforeEach(async () => {
    contributionsRepository = {
      create: jest.fn().mockResolvedValue({ id: 'contrib-1' }),
      sumByGoal: jest.fn(),
    };
    goalsRepository = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
    };
    eventEmitter = { emit: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GoalContributionsService,
        { provide: GoalContributionsRepository, useValue: contributionsRepository },
        { provide: GoalsRepository, useValue: goalsRepository },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = moduleRef.get(GoalContributionsService);
  });

  it('does not complete the goal when contributions stay below the target', async () => {
    goalsRepository.findById.mockResolvedValue(buildGoal({ targetAmount: 25000, status: 'active' }));
    contributionsRepository.sumByGoal.mockResolvedValue(2600);

    await service.create('user-1', 'goal-1', { amount: 2600, contributedAt: '2026-09-06' });

    expect(goalsRepository.updateStatus).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });

  it('marks the goal as completed and emits goal.completed when the total reaches the target', async () => {
    goalsRepository.findById.mockResolvedValue(buildGoal({ targetAmount: 25000, status: 'active' }));
    contributionsRepository.sumByGoal.mockResolvedValue(25000);
    goalsRepository.updateStatus.mockResolvedValue(buildGoal({ status: 'completed' }));

    await service.create('user-1', 'goal-1', { amount: 25000, contributedAt: '2026-09-06' });

    expect(goalsRepository.updateStatus).toHaveBeenCalledWith('user-1', 'goal-1', 'completed');
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'goal.completed',
      expect.objectContaining({ goal: expect.objectContaining({ status: 'completed' }) }),
    );
  });

  it('does not re-trigger completion for a goal that is already completed', async () => {
    goalsRepository.findById.mockResolvedValue(buildGoal({ targetAmount: 25000, status: 'completed' }));
    contributionsRepository.sumByGoal.mockResolvedValue(30000);

    await service.create('user-1', 'goal-1', { amount: 5000, contributedAt: '2026-09-06' });

    expect(goalsRepository.updateStatus).not.toHaveBeenCalled();
    expect(eventEmitter.emit).not.toHaveBeenCalled();
  });
});
