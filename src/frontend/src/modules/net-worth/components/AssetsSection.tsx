'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AssetType } from '@saldix/shared-types';
import { formatCurrency } from '@/shared/lib/formatters';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useAssets, useCreateAsset, useDeleteAsset } from '../hooks/useNetWorth';
import { VehicleLookupForm } from './VehicleLookupForm';

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  real_estate: 'Imóvel',
  vehicle: 'Veículo',
  other: 'Outro',
};

export function AssetsSection() {
  const { data: assets } = useAssets();
  const createAsset = useCreateAsset();
  const deleteAsset = useDeleteAsset();
  const [assetType, setAssetType] = useState<AssetType>('real_estate');
  const [name, setName] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [fipeCode, setFipeCode] = useState<string | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createAsset.mutateAsync({
      assetType,
      name: name.trim(),
      currentValue: Number(currentValue),
      fipeCode,
    });
    setName('');
    setCurrentValue('');
    setFipeCode(undefined);
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Bens</h2>

      <ul className="divide-y divide-surface-border">
        {assets?.map((asset) => (
          <li
            key={asset.id}
            className="flex min-w-0 flex-wrap items-center justify-between gap-2 py-3 [overflow-wrap:anywhere]"
          >
            <div>
              <span className="text-gray-100">{asset.name}</span>
              <p className="text-xs text-gray-500">{ASSET_TYPE_LABELS[asset.assetType]}</p>
            </div>
            <div className="flex min-w-0 max-w-full items-center gap-2">
              <span className="font-semibold text-gray-100">
                {formatCurrency(asset.currentValue)}
              </span>
              <button
                type="button"
                aria-label="Excluir bem"
                onClick={() => setPendingDelete({ id: asset.id, name: asset.name })}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {assets?.length === 0 && (
          <p className="py-2 text-sm text-gray-500">Nenhum bem cadastrado.</p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-3">
        <div className="grid min-w-0 grid-cols-1 gap-3">
          <select
            aria-label="Tipo de bem"
            value={assetType}
            onChange={(e) => setAssetType(e.target.value as AssetType)}
            className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
          >
            <option value="real_estate">Imóvel</option>
            <option value="vehicle">Veículo</option>
            <option value="other">Outro</option>
          </select>
          <input
            aria-label="Nome do bem"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Apartamento 506"
            className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
          />
        </div>

        {assetType === 'vehicle' && (
          <VehicleLookupForm
            onResult={(result) => {
              setCurrentValue(String(result.estimatedValue));
              setFipeCode(result.fipeCode);
            }}
          />
        )}

        <div className="grid min-w-0 grid-cols-1 gap-3">
          <CurrencyInput
            aria-label="Valor de mercado (R$)"
            required

            min="0"
            step="0.01"
            value={currentValue}
            onValueChange={setCurrentValue}
            placeholder="Valor de mercado"
            className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
          />
          <button
            type="submit"
            disabled={createAsset.isPending}
            className="flex items-center justify-center rounded-lg bg-brand px-3 py-2 text-black hover:bg-brand-dark disabled:opacity-50"
          >
            <Plus size={16} />
            <span className="ml-2">Adicionar</span>
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir bem"
        description={pendingDelete ? `Excluir "${pendingDelete.name}"?` : ''}
        confirmLabel="Excluir"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteAsset.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
