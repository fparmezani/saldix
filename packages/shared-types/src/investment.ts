import { z } from 'zod';

export const investmentCategorySchema = z.enum(['renda_fixa', 'fiis', 'acoes', 'cripto', 'outros']);
export type InvestmentCategory = z.infer<typeof investmentCategorySchema>;

export const SHARE_BASED_INVESTMENT_CATEGORIES: InvestmentCategory[] = ['fiis', 'acoes', 'cripto'];
export function isShareBasedCategory(category: InvestmentCategory): boolean {
  return SHARE_BASED_INVESTMENT_CATEGORIES.includes(category);
}

export const investmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1),
  category: investmentCategorySchema,
  investedAmount: z.number().nonnegative(),
  currentAmount: z.number().nonnegative(),
  ticker: z.string().nullable(),
  quantity: z.number().nullable(),
  marketPricePerUnit: z.number().nullable(),
  targetPercentage: z.number().min(0).max(100).nullable(),
  createdAt: z.string().datetime(),
});
export type Investment = z.infer<typeof investmentSchema>;

export const investmentWithGainSchema = investmentSchema.extend({
  gainAmount: z.number(),
  gainPercentage: z.number(),
});
export type InvestmentWithGain = z.infer<typeof investmentWithGainSchema>;

export const createInvestmentSchema = z.object({
  name: z.string().min(1),
  category: investmentCategorySchema,
  investedAmount: z.number().nonnegative(),
  currentAmount: z.number().nonnegative(),
  ticker: z.string().min(1).optional(),
  quantity: z.number().positive().optional(),
  marketPricePerUnit: z.number().positive().optional(),
  targetPercentage: z.number().min(0).max(100).optional(),
});
export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;

export const updateInvestmentSchema = createInvestmentSchema.partial();
export type UpdateInvestmentInput = z.infer<typeof updateInvestmentSchema>;

export const investmentCategorySummarySchema = z.object({
  category: investmentCategorySchema,
  count: z.number(),
  totalInvested: z.number(),
  totalCurrent: z.number(),
  totalGainAmount: z.number(),
  totalGainPercentage: z.number(),
  allocatedPercentage: z.number(),
});
export type InvestmentCategorySummary = z.infer<typeof investmentCategorySummarySchema>;

export const investmentsSummarySchema = z.object({
  totalInvested: z.number(),
  totalCurrent: z.number(),
  totalGainAmount: z.number(),
  totalGainPercentage: z.number(),
  byCategory: z.array(investmentCategorySummarySchema),
});
export type InvestmentsSummary = z.infer<typeof investmentsSummarySchema>;
