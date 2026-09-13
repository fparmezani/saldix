export interface VariableExpense {
  id: string;
  userId: string;
  categoryId: string;
  description: string;
  amount: number;
  expenseDate: string;
  installmentGroupId: string | null;
  installmentNumber: number | null;
  installmentTotal: number | null;
  cardId: string | null;
  bankAccountId: string | null;
  createdAt: string;
}
