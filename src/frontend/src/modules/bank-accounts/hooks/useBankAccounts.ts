import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ConfirmStatementImportInput,
  CreateBankAccountInput,
  CreateCardInput,
  StatementSourceType,
} from '@saldix/shared-types';
import {
  confirmStatementImport,
  createBankAccount,
  createCard,
  fetchBankAccounts,
  fetchCards,
  uploadStatementPreview,
} from '../api/bank-accounts';

export function useBankAccounts() {
  return useQuery({ queryKey: ['bank-accounts'], queryFn: fetchBankAccounts });
}

export function useCreateBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBankAccountInput) => createBankAccount(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bank-accounts'] }),
  });
}

export function useCards(bankAccountId: string) {
  return useQuery({
    queryKey: ['cards', bankAccountId],
    queryFn: () => fetchCards(bankAccountId),
    enabled: Boolean(bankAccountId),
  });
}

export function useCreateCard(bankAccountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCardInput) => createCard(bankAccountId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards', bankAccountId] }),
  });
}

export function useUploadStatementPreview(bankAccountId: string) {
  return useMutation({
    mutationFn: ({ sourceType, file }: { sourceType: StatementSourceType; file: File }) =>
      uploadStatementPreview(bankAccountId, sourceType, file),
  });
}

export function useConfirmStatementImport(bankAccountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ConfirmStatementImportInput) =>
      confirmStatementImport(bankAccountId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', bankAccountId] });
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['variable-expenses'] });
    },
  });
}
