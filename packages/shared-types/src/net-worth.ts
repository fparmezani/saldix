import { z } from 'zod';

export const liquidAccountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1),
  amount: z.number().nonnegative(),
  createdAt: z.string().datetime(),
});
export type LiquidAccount = z.infer<typeof liquidAccountSchema>;

export const createLiquidAccountSchema = z.object({
  name: z.string().min(1),
  amount: z.number().nonnegative(),
});
export type CreateLiquidAccountInput = z.infer<typeof createLiquidAccountSchema>;

export const updateLiquidAccountSchema = createLiquidAccountSchema.partial();
export type UpdateLiquidAccountInput = z.infer<typeof updateLiquidAccountSchema>;

export const assetTypeSchema = z.enum(['real_estate', 'vehicle', 'other']);
export type AssetType = z.infer<typeof assetTypeSchema>;

export const assetSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  assetType: assetTypeSchema,
  name: z.string().min(1),
  currentValue: z.number().nonnegative(),
  fipeCode: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type Asset = z.infer<typeof assetSchema>;

export const createAssetSchema = z.object({
  assetType: assetTypeSchema,
  name: z.string().min(1),
  currentValue: z.number().nonnegative(),
  fipeCode: z.string().optional(),
});
export type CreateAssetInput = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = z.object({
  name: z.string().min(1).optional(),
  currentValue: z.number().nonnegative().optional(),
});
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

export const debtSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  assetId: z.string().uuid().nullable(),
  name: z.string().min(1),
  outstandingBalance: z.number().nonnegative(),
  createdAt: z.string().datetime(),
});
export type Debt = z.infer<typeof debtSchema>;

export const createDebtSchema = z.object({
  assetId: z.string().uuid().optional(),
  name: z.string().min(1),
  outstandingBalance: z.number().nonnegative(),
});
export type CreateDebtInput = z.infer<typeof createDebtSchema>;

export const updateDebtSchema = z.object({
  name: z.string().min(1).optional(),
  outstandingBalance: z.number().nonnegative().optional(),
});
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>;

export const netWorthSummarySchema = z.object({
  totalLiquidity: z.number(),
  totalInvestments: z.number(),
  totalAssets: z.number(),
  totalDebts: z.number(),
  netWorth: z.number(),
});
export type NetWorthSummary = z.infer<typeof netWorthSummarySchema>;

export const vehicleLookupResultSchema = z.object({
  fipeCode: z.string(),
  estimatedValue: z.number(),
});
export type VehicleLookupResult = z.infer<typeof vehicleLookupResultSchema>;
