export type IncomeType = 'main' | 'extra';

export interface Income {
  id: string;
  userId: string;
  type: IncomeType;
  description: string;
  amount: number;
  referenceMonth: string;
  futureReceivableId: string | null;
  incomeScheduleId: string | null;
  createdAt: string;
}
