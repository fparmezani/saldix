import { IncomeType } from '../entities/income.entity';

export type FutureReceivableStatus = 'pending' | 'received';

export interface FutureReceivable {
  id: string;
  userId: string;
  description: string;
  amount: number;
  expectedDate: string;
  status: FutureReceivableStatus;
  receivedAt: string | null;
  incomeType: IncomeType;
  createdAt: string;
}
