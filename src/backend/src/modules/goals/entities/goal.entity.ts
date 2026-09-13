export type GoalStatusValue = 'active' | 'completed';

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  status: GoalStatusValue;
  createdAt: string;
}
