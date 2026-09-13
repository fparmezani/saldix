import { Injectable, NotFoundException } from '@nestjs/common';
import { GoalContributionsRepository } from './contributions/goal-contributions.repository';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { calculateGoalStatus } from './goal-status.calculator';
import { GoalsRepository } from './goals.repository';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Injectable()
export class GoalsService {
  constructor(
    private readonly goalsRepository: GoalsRepository,
    private readonly contributionsRepository: GoalContributionsRepository,
  ) {}

  async getAllWithStatus(userId: string) {
    const [goals, totalsByGoal] = await Promise.all([
      this.goalsRepository.findAllByUser(userId),
      this.contributionsRepository.sumForAllGoals(userId),
    ]);

    const today = todayIso();
    return goals.map((goal) => ({
      ...goal,
      ...calculateGoalStatus({
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
        totalContributed: totalsByGoal[goal.id] ?? 0,
        today,
      }),
    }));
  }

  async create(userId: string, dto: CreateGoalDto) {
    return this.goalsRepository.create(userId, dto);
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    try {
      return await this.goalsRepository.update(userId, id, dto);
    } catch {
      throw new NotFoundException('Goal not found');
    }
  }

  async remove(userId: string, id: string) {
    await this.goalsRepository.delete(userId, id);
  }
}
