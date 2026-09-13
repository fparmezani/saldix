'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { useAssets } from '../hooks/useNetWorth';
import { useCreateDebt, useDebts, useDeleteDebt } from '../hooks/useNetWorth';

export function DebtsSection() {
  const { data: debts } = useDebts();
  const { data: assets } = useAssets();
  const createDebt = useCreateDebt();
  const deleteDebt = useDeleteDebt();
  const [name, setName] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [assetId, setAssetId] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const assetById = new Map((assets ?? []).map((a) => [a.id, a]));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createDebt.mutateAsync({
      name: name.trim(),
      outstandingBalance: Number(outstandingBalance),
      assetId: assetId || undefined,
    });
    setName('');
    setOutstandingBalance('');
    setAssetId('');
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Dívidas</h2>

      <ul className="divide-y divide-surface-border">
        {debts?.map((debt) => (
          <li
            key={debt.id}
            className="flex min-w-0 flex-wrap items-center justify-between gap-2 py-3 [overflow-wrap:anywhere]"
          >
            <div>
              <span className="text-gray-100">{debt.name}</span>
              {debt.assetId && assetById.get(debt.assetId) && (
                <p className="text-xs text-gray-500">
                  Vinculada a {assetById.get(debt.assetId)?.name}
                </p>
              )}
            </div>
            <div className="flex min-w-0 max-w-full items-center gap-2">
              <span className="font-semibold text-rose-400">
                -{formatCurrency(debt.outstandingBalance)}
              </span>
              <button
                type="button"
                aria-label="Excluir dívida"
                onClick={() => setPendingDelete({ id: debt.id, name: debt.name })}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {debts?.length === 0 && (
          <p className="py-2 text-sm text-gray-500">Nenhuma dívida cadastrada.</p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-3">
        <div className="grid min-w-0 grid-cols-1 gap-3">
          <input
            aria-label="Descrição da dívida"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Financiamento apartamento"
            className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
          />
          <CurrencyInput
            aria-label="Saldo devedor (R$)"
            required

            min="0"
            step="0.01"
            value={outstandingBalance}
            onValueChange={setOutstandingBalance}
            placeholder="Saldo devedor"
            className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
          />
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-3">
          <select
            aria-label="Bem vinculado à dívida"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
          >
            <option value="">Sem vínculo com bem</option>
            {assets?.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={createDebt.isPending}
            className="flex items-center justify-center rounded-lg bg-brand px-3 py-2 text-black hover:bg-brand-dark disabled:opacity-50"
          >
            <Plus size={16} />
            <span className="ml-2">Adicionar</span>
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir dívida"
        description={pendingDelete ? `Excluir "${pendingDelete.name}"?` : ''}
        confirmLabel="Excluir"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteDebt.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
