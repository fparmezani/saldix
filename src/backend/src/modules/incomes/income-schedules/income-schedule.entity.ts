import { IncomeType } from '../entities/income.entity';

export interface IncomeSchedule {
  id: string;
  userId: string;
  type: IncomeType;
  description: string;
  amount: number;
  recurrenceDay: number;
  active: boolean;
  createdAt: string;
}
