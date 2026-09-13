import { z } from 'zod';

export const incomeTypeSchema = z.enum(['main', 'extra']);
export type IncomeType = z.infer<typeof incomeTypeSchema>;

export const incomeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: incomeTypeSchema,
  description: z.string().min(1),
  amount: z.number().nonnegative(),
  referenceMonth: z.string(), // 'YYYY-MM-01'
  futureReceivableId: z.string().uuid().nullable(),
  incomeScheduleId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
});
export type Income = z.infer<typeof incomeSchema>;

export const createIncomeSchema = z.object({
  type: incomeTypeSchema,
  description: z.string().min(1),
  amount: z.number().positive(),
  referenceMonth: z.string(),
});
export type CreateIncomeInput = z.infer<typeof createIncomeSchema>;

export const updateIncomeSchema = createIncomeSchema.partial();
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>;
