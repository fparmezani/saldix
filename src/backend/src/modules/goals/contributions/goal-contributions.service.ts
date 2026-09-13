import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GoalsRepository } from '../goals.repository';
import { CreateGoalContributionDto } from './dto/create-goal-contribution.dto';
import { GoalContributionsRepository } from './goal-contributions.repository';

@Injectable()
export class GoalContributionsService {
  constructor(
    private readonly contributionsRepository: GoalContributionsRepository,
    private readonly goalsRepository: GoalsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async listByGoal(userId: string, goalId: string) {
    return this.contributionsRepository.findByGoal(userId, goalId);
  }

  async create(userId: string, goalId: string, dto: CreateGoalContributionDto) {
    const goal = await this.goalsRepository.findById(userId, goalId);
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const contribution = await this.contributionsRepository.create(userId, goalId, dto);

    const totalContributed = await this.contributionsRepository.sumByGoal(userId, goalId);
    if (totalContributed >= goal.targetAmount && goal.status !== 'completed') {
      const updatedGoal = await this.goalsRepository.updateStatus(userId, goalId, 'completed');
      this.eventEmitter.emit('goal.completed', { goal: updatedGoal });
    }

    return contribution;
  }
}
