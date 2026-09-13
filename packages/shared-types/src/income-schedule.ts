import { z } from 'zod';
import { incomeTypeSchema } from './income';

export const incomeScheduleSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: incomeTypeSchema,
  description: z.string().min(1),
  amount: z.number().positive(),
  recurrenceDay: z.number().int().min(1).max(31),
  active: z.boolean(),
  createdAt: z.string().datetime(),
});
export type IncomeSchedule = z.infer<typeof incomeScheduleSchema>;

export const createIncomeScheduleSchema = z.object({
  type: incomeTypeSchema,
  description: z.string().min(1),
  amount: z.number().positive(),
  recurrenceDay: z.number().int().min(1).max(31),
});
export type CreateIncomeScheduleInput = z.infer<typeof createIncomeScheduleSchema>;

export const updateIncomeScheduleSchema = z.object({
  amount: z.number().positive().optional(),
  recurrenceDay: z.number().int().min(1).max(31).optional(),
  active: z.boolean().optional(),
});
export type UpdateIncomeScheduleInput = z.infer<typeof updateIncomeScheduleSchema>;
