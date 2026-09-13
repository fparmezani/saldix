import { z } from 'zod';

export const investModeSchema = z.enum(['percentage', 'fixed']);
export type InvestMode = z.infer<typeof investModeSchema>;

export const budgetSettingsSchema = z.object({
  referenceMonth: z.string(),
  investMode: investModeSchema,
  investPercentage: z.number().nullable(),
  investFixedAmount: z.number().nullable(),
});
export type BudgetSettings = z.infer<typeof budgetSettingsSchema>;

export const updateBudgetSettingsSchema = z
  .object({
    referenceMonth: z.string(),
    investMode: investModeSchema,
    investPercentage: z.number().min(0).max(100).optional(),
    investFixedAmount: z.number().nonnegative().optional(),
  })
  .refine(
    (data) =>
      data.investMode === 'percentage'
        ? data.investPercentage !== undefined
        : data.investFixedAmount !== undefined,
    { message: 'investPercentage is required for percentage mode, investFixedAmount for fixed mode' },
  );
export type UpdateBudgetSettingsInput = z.infer<typeof updateBudgetSettingsSchema>;

export const budgetSummarySchema = z.object({
  totalIncome: z.number(),
  totalExpenses: z.number(),
  investAmount: z.number(),
  balance: z.number(),
});
export type BudgetSummary = z.infer<typeof budgetSummarySchema>;

export const overviewPointSchema = z.object({
  month: z.string(),
  totalIncome: z.number(),
  totalExpenses: z.number(),
});
export type OverviewPoint = z.infer<typeof overviewPointSchema>;
