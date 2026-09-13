import { z } from 'zod';

export const fixedExpenseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  categoryId: z.string().uuid(),
  description: z.string().min(1),
  amount: z.number().positive(),
  dueDay: z.number().int().min(1).max(31),
  referenceMonth: z.string(),
  cardId: z.string().uuid().nullable(),
  bankAccountId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});
export type FixedExpense = z.infer<typeof fixedExpenseSchema>;

export const createFixedExpenseSchema = z.object({
  categoryId: z.string().uuid(),
  description: z.string().min(1),
  amount: z.number().positive(),
  dueDay: z.number().int().min(1).max(31),
  referenceMonth: z.string(),
  cardId: z.string().uuid().optional(),
  bankAccountId: z.string().uuid().optional(),
});
export type CreateFixedExpenseInput = z.infer<typeof createFixedExpenseSchema>;

export const updateFixedExpenseSchema = createFixedExpenseSchema.partial();
export type UpdateFixedExpenseInput = z.infer<typeof updateFixedExpenseSchema>;
