import { z } from 'zod';

export const variableExpenseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  description: z.string().min(1),
  amount: z.number().positive(),
  expenseDate: z.string(),
  installmentGroupId: z.string().uuid().nullable(),
  installmentNumber: z.number().int().positive().nullable(),
  installmentTotal: z.number().int().positive().nullable(),
  cardId: z.string().uuid().nullable(),
  bankAccountId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});
export type VariableExpense = z.infer<typeof variableExpenseSchema>;

export const createVariableExpenseSchema = z
  .object({
    categoryId: z.string().uuid(),
    description: z.string().min(1),
    amount: z.number().positive(),
    expenseDate: z.string(),
    installments: z.number().int().min(2).max(60).optional(),
    cardId: z.string().uuid().optional(),
    bankAccountId: z.string().uuid().optional(),
  })
  .refine((data) => data.installments === undefined || data.installments >= 2, {
    message: 'installments must be at least 2 when provided',
    path: ['installments'],
  });
export type CreateVariableExpenseInput = z.infer<typeof createVariableExpenseSchema>;

export const updateVariableExpenseSchema = z.object({
  categoryId: z.string().uuid().optional(),
  description: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  expenseDate: z.string().optional(),
  cardId: z.string().uuid().optional(),
  bankAccountId: z.string().uuid().optional(),
});
export type UpdateVariableExpenseInput = z.infer<typeof updateVariableExpenseSchema>;
