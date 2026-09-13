import type {
  BankAccount,
  Card,
  ConfirmStatementImportInput,
  CreateBankAccountInput,
  CreateCardInput,
  StatementImportPreview,
  StatementSourceType,
} from '@saldix/shared-types';
import { apiFetch, apiUpload } from '@/shared/lib/api-client';

export function fetchBankAccounts() {
  return apiFetch<BankAccount[]>('/bank-accounts');
}

export function createBankAccount(input: CreateBankAccountInput) {
  return apiFetch<BankAccount>('/bank-accounts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function fetchCards(bankAccountId: string) {
  return apiFetch<Card[]>(`/bank-accounts/${bankAccountId}/cards`);
}

export function createCard(bankAccountId: string, input: CreateCardInput) {
  return apiFetch<Card>(`/bank-accounts/${bankAccountId}/cards`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function uploadStatementPreview(
  bankAccountId: string,
  sourceType: StatementSourceType,
  file: File,
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sourceType', sourceType);
  return apiUpload<StatementImportPreview>(
    `/bank-accounts/${bankAccountId}/statement-preview`,
    formData,
  );
}

export function confirmStatementImport(
  bankAccountId: string,
  input: ConfirmStatementImportInput,
) {
  return apiFetch<{ success: boolean }>(`/bank-accounts/${bankAccountId}/statement-confirm`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
