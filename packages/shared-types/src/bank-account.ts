import { z } from 'zod';

export const bankAccountTypeSchema = z.enum(['checking', 'investment']);
export type BankAccountType = z.infer<typeof bankAccountTypeSchema>;

export const bankAccountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: bankAccountTypeSchema,
  bankCode: z.string(),
  bankName: z.string(),
  agency: z.string(),
  accountNumber: z.string(),
  createdAt: z.string().datetime(),
});
export type BankAccount = z.infer<typeof bankAccountSchema>;

export const createBankAccountSchema = z.object({
  type: bankAccountTypeSchema,
  bankCode: z.string().min(1),
  agency: z.string().min(1),
  accountNumber: z.string().min(1),
});
export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;

export const cardBrandSchema = z.enum(['visa', 'mastercard', 'other']);
export type CardBrand = z.infer<typeof cardBrandSchema>;

export const cardSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  bankAccountId: z.string().uuid(),
  name: z.string().min(1),
  lastDigits: z.string().nullable(),
  brand: cardBrandSchema,
  createdAt: z.string().datetime(),
});
export type Card = z.infer<typeof cardSchema>;

export const createCardSchema = z.object({
  name: z.string().min(1),
  lastDigits: z.string().optional(),
  brand: cardBrandSchema,
});
export type CreateCardInput = z.infer<typeof createCardSchema>;

export const statementSourceTypeSchema = z.enum(['card_invoice', 'bank_statement']);
export type StatementSourceType = z.infer<typeof statementSourceTypeSchema>;

export const linkExpenseTypeSchema = z.enum(['fixed', 'variable']);
export type LinkExpenseType = z.infer<typeof linkExpenseTypeSchema>;

export const statementTransactionPreviewSchema = z.object({
  lineId: z.string(),
  cardIndex: z.number().int().nonnegative(),
  description: z.string(),
  amount: z.number(),
  expenseDate: z.string(),
  installmentNumber: z.number().int().positive().nullable(),
  installmentTotal: z.number().int().positive().nullable(),
  suggestedCategoryId: z.string().uuid().nullable(),
  categoryId: z.string().uuid().nullable(),
  isRecurring: z.boolean(),
  include: z.boolean(),
  linkToExpenseId: z.string().uuid().nullable(),
  linkToExpenseType: linkExpenseTypeSchema.nullable(),
});
export type StatementTransactionPreview = z.infer<typeof statementTransactionPreviewSchema>;

export const detectedCardSchema = z.object({
  cardIndex: z.number().int().nonnegative(),
  suggestedName: z.string(),
  lastDigits: z.string().nullable(),
  existingCardId: z.string().uuid().nullable(),
});
export type DetectedCard = z.infer<typeof detectedCardSchema>;

export const statementImportPreviewSchema = z.object({
  sourceType: statementSourceTypeSchema,
  bankAccountId: z.string().uuid(),
  detectedCards: z.array(detectedCardSchema),
  transactions: z.array(statementTransactionPreviewSchema),
});
export type StatementImportPreview = z.infer<typeof statementImportPreviewSchema>;

export const confirmStatementCardSchema = z.object({
  cardIndex: z.number().int().nonnegative(),
  name: z.string().min(1),
  lastDigits: z.string().optional(),
  brand: cardBrandSchema.optional(),
  existingCardId: z.string().uuid().nullable(),
});

export const confirmStatementTransactionSchema = z.object({
  cardIndex: z.number().int().nonnegative(),
  description: z.string().min(1),
  amount: z.number().positive(),
  expenseDate: z.string(),
  installmentNumber: z.number().int().positive().nullable(),
  installmentTotal: z.number().int().positive().nullable(),
  categoryId: z.string().uuid().nullable(),
  isRecurring: z.boolean(),
  linkToExpenseId: z.string().uuid().nullable(),
  linkToExpenseType: linkExpenseTypeSchema.nullable(),
});

export const confirmStatementImportSchema = z.object({
  sourceType: statementSourceTypeSchema,
  bankAccountId: z.string().uuid(),
  cards: z.array(confirmStatementCardSchema),
  transactions: z.array(confirmStatementTransactionSchema),
});
export type ConfirmStatementImportInput = z.infer<typeof confirmStatementImportSchema>;
