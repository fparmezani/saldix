import { z } from 'zod';

export const goalStatusValueSchema = z.enum(['active', 'completed']);
export type GoalStatusValue = z.infer<typeof goalStatusValueSchema>;

export const goalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  targetDate: z.string(),
  status: goalStatusValueSchema,
  createdAt: z.string().datetime(),
});
export type Goal = z.infer<typeof goalSchema>;

export const createGoalSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  targetDate: z.string(),
});
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = createGoalSchema.partial();
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export const goalWithStatusSchema = goalSchema.extend({
  monthlyRequired: z.number(),
  totalContributed: z.number(),
  progressPercentage: z.number(),
  isOverdue: z.boolean(),
});
export type GoalWithStatus = z.infer<typeof goalWithStatusSchema>;

export const goalContributionSchema = z.object({
  id: z.string().uuid(),
  goalId: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  contributedAt: z.string(),
  createdAt: z.string().datetime(),
});
export type GoalContribution = z.infer<typeof goalContributionSchema>;

export const createGoalContributionSchema = z.object({
  amount: z.number().positive(),
  contributedAt: z.string(),
});
export type CreateGoalContributionInput = z.infer<typeof createGoalContributionSchema>;
