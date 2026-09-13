import { z } from 'zod';
import { incomeTypeSchema } from './income';

export const futureReceivableStatusSchema = z.enum(['pending', 'received']);
export type FutureReceivableStatus = z.infer<typeof futureReceivableStatusSchema>;

export const futureReceivableSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  description: z.string().min(1),
  amount: z.number().nonnegative(),
  expectedDate: z.string(), // 'YYYY-MM-DD'
  status: futureReceivableStatusSchema,
  receivedAt: z.string().datetime().nullable(),
  incomeType: incomeTypeSchema,
  createdAt: z.string().datetime(),
});
export type FutureReceivable = z.infer<typeof futureReceivableSchema>;

export const createFutureReceivableSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  expectedDate: z.string(),
  incomeType: incomeTypeSchema,
});
export type CreateFutureReceivableInput = z.infer<typeof createFutureReceivableSchema>;

export const rescheduleFutureReceivableSchema = z.object({
  newExpectedDate: z.string(),
});
export type RescheduleFutureReceivableInput = z.infer<typeof rescheduleFutureReceivableSchema>;
