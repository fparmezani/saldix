import type {
  Asset,
  CreateAssetInput,
  CreateDebtInput,
  CreateLiquidAccountInput,
  Debt,
  LiquidAccount,
  NetWorthSummary,
  UpdateAssetInput,
  UpdateDebtInput,
  UpdateLiquidAccountInput,
  VehicleLookupResult,
} from '@saldix/shared-types';
import { apiFetch } from '@/shared/lib/api-client';

export function fetchNetWorthSummary() {
  return apiFetch<NetWorthSummary>('/net-worth/summary');
}

// Liquidez
export function fetchLiquidAccounts() {
  return apiFetch<LiquidAccount[]>('/net-worth/liquid-accounts');
}
export function createLiquidAccount(input: CreateLiquidAccountInput) {
  return apiFetch<LiquidAccount>('/net-worth/liquid-accounts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
export function updateLiquidAccount(id: string, input: UpdateLiquidAccountInput) {
  return apiFetch<LiquidAccount>(`/net-worth/liquid-accounts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
export function deleteLiquidAccount(id: string) {
  return apiFetch<void>(`/net-worth/liquid-accounts/${id}`, { method: 'DELETE' });
}

// Bens
export function fetchAssets() {
  return apiFetch<Asset[]>('/net-worth/assets');
}
export function createAsset(input: CreateAssetInput) {
  return apiFetch<Asset>('/net-worth/assets', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
export function updateAsset(id: string, input: UpdateAssetInput) {
  return apiFetch<Asset>(`/net-worth/assets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
export function deleteAsset(id: string) {
  return apiFetch<void>(`/net-worth/assets/${id}`, { method: 'DELETE' });
}
export function lookupVehicle(brand: string, model: string, year: number) {
  return apiFetch<VehicleLookupResult>(
    `/net-worth/vehicle-lookup?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${year}`,
  );
}

// Dívidas
export function fetchDebts() {
  return apiFetch<Debt[]>('/net-worth/debts');
}
export function createDebt(input: CreateDebtInput) {
  return apiFetch<Debt>('/net-worth/debts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
export function updateDebt(id: string, input: UpdateDebtInput) {
  return apiFetch<Debt>(`/net-worth/debts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}
export function deleteDebt(id: string) {
  return apiFetch<void>(`/net-worth/debts/${id}`, { method: 'DELETE' });
}
