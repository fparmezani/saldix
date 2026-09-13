import { z } from 'zod';

export const protectionTypeSchema = z.enum(['basic', 'shielded']);
export type ProtectionType = z.infer<typeof protectionTypeSchema>;

export const emergencyFundSettingsSchema = z.object({
  protectionType: protectionTypeSchema,
  monthlyEssentialCost: z.number(),
});
export type EmergencyFundSettings = z.infer<typeof emergencyFundSettingsSchema>;

export const updateEmergencyFundSettingsSchema = z.object({
  protectionType: protectionTypeSchema,
  monthlyEssentialCost: z.number().positive(),
});
export type UpdateEmergencyFundSettingsInput = z.infer<typeof updateEmergencyFundSettingsSchema>;

export const emergencyFundStatusSchema = z.object({
  protectionType: protectionTypeSchema,
  targetAmount: z.number(),
  totalContributed: z.number(),
  progressPercentage: z.number(),
});
export type EmergencyFundStatus = z.infer<typeof emergencyFundStatusSchema>;

export const emergencyFundContributionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  contributedAt: z.string(),
  note: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type EmergencyFundContribution = z.infer<typeof emergencyFundContributionSchema>;

export const createEmergencyFundContributionSchema = z.object({
  amount: z.number().positive(),
  contributedAt: z.string(),
  note: z.string().optional(),
});
export type CreateEmergencyFundContributionInput = z.infer<
  typeof createEmergencyFundContributionSchema
>;
