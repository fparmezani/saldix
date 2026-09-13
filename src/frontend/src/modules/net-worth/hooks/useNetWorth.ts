import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateAssetInput, CreateDebtInput, CreateLiquidAccountInput } from '@saldix/shared-types';
import {
  createAsset,
  createDebt,
  createLiquidAccount,
  deleteAsset,
  deleteDebt,
  deleteLiquidAccount,
  fetchAssets,
  fetchDebts,
  fetchLiquidAccounts,
  fetchNetWorthSummary,
} from '../api/net-worth';

export function useNetWorthSummary() {
  return useQuery({ queryKey: ['net-worth-summary'], queryFn: fetchNetWorthSummary });
}

function useInvalidateNetWorth() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['net-worth-summary'] });
    queryClient.invalidateQueries({ queryKey: ['liquid-accounts'] });
    queryClient.invalidateQueries({ queryKey: ['net-worth-assets'] });
    queryClient.invalidateQueries({ queryKey: ['net-worth-debts'] });
  };
}

// Liquidez
export function useLiquidAccounts() {
  return useQuery({ queryKey: ['liquid-accounts'], queryFn: fetchLiquidAccounts });
}
export function useCreateLiquidAccount() {
  const invalidate = useInvalidateNetWorth();
  return useMutation({
    mutationFn: (input: CreateLiquidAccountInput) => createLiquidAccount(input),
    onSuccess: invalidate,
  });
}
export function useDeleteLiquidAccount() {
  const invalidate = useInvalidateNetWorth();
  return useMutation({
    mutationFn: (id: string) => deleteLiquidAccount(id),
    onSuccess: invalidate,
  });
}

// Bens
export function useAssets() {
  return useQuery({ queryKey: ['net-worth-assets'], queryFn: fetchAssets });
}
export function useCreateAsset() {
  const invalidate = useInvalidateNetWorth();
  return useMutation({
    mutationFn: (input: CreateAssetInput) => createAsset(input),
    onSuccess: invalidate,
  });
}
export function useDeleteAsset() {
  const invalidate = useInvalidateNetWorth();
  return useMutation({
    mutationFn: (id: string) => deleteAsset(id),
    onSuccess: invalidate,
  });
}

// Dívidas
export function useDebts() {
  return useQuery({ queryKey: ['net-worth-debts'], queryFn: fetchDebts });
}
export function useCreateDebt() {
  const invalidate = useInvalidateNetWorth();
  return useMutation({
    mutationFn: (input: CreateDebtInput) => createDebt(input),
    onSuccess: invalidate,
  });
}
export function useDeleteDebt() {
  const invalidate = useInvalidateNetWorth();
  return useMutation({
    mutationFn: (id: string) => deleteDebt(id),
    onSuccess: invalidate,
  });
}
