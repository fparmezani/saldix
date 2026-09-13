export interface FixedExpense {
  id: string;
  userId: string;
  categoryId: string;
  description: string;
  amount: number;
  dueDay: number;
  referenceMonth: string;
  cardId: string | null;
  bankAccountId: string | null;
  createdAt: string;
}
