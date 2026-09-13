import { Module } from '@nestjs/common';
import { GoalContributionsRepository } from './contributions/goal-contributions.repository';
import { GoalContributionsService } from './contributions/goal-contributions.service';
import { GoalsController } from './goals.controller';
import { GoalsRepository } from './goals.repository';
import { GoalsService } from './goals.service';

@Module({
  controllers: [GoalsController],
  providers: [
    GoalsService,
    GoalsRepository,
    GoalContributionsService,
    GoalContributionsRepository,
  ],
})
export class GoalsModule {}
