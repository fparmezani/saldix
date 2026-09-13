'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import {
  useCreateLiquidAccount,
  useDeleteLiquidAccount,
  useLiquidAccounts,
} from '../hooks/useNetWorth';

export function LiquidAccountsSection() {
  const { data: accounts } = useLiquidAccounts();
  const createAccount = useCreateLiquidAccount();
  const deleteAccount = useDeleteLiquidAccount();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createAccount.mutateAsync({ name: name.trim(), amount: Number(amount) });
    setName('');
    setAmount('');
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Liquidez</h2>

      <ul className="divide-y divide-surface-border">
        {accounts?.map((account) => (
          <li
            key={account.id}
            className="flex min-w-0 flex-wrap items-center justify-between gap-2 py-3 [overflow-wrap:anywhere]"
          >
            <span className="text-gray-100">{account.name}</span>
            <div className="flex min-w-0 max-w-full items-center gap-2">
              <span className="font-semibold text-gray-100">{formatCurrency(account.amount)}</span>
              <button
                type="button"
                aria-label="Excluir conta"
                onClick={() => setPendingDelete({ id: account.id, name: account.name })}
                className="text-gray-500 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
        {accounts?.length === 0 && (
          <p className="py-2 text-sm text-gray-500">Nenhuma conta cadastrada.</p>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="grid min-w-0 grid-cols-1 gap-3">
        <input
          aria-label="Nome da conta"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Conta Bradesco"
          className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
        />
        <CurrencyInput
          aria-label="Saldo disponível (R$)"
          required

          min="0"
          step="0.01"
          value={amount}
          onValueChange={setAmount}
          placeholder="Valor"
          className="min-w-0 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-gray-100"
        />
        <button
          type="submit"
          disabled={createAccount.isPending}
          className="flex items-center justify-center rounded-lg bg-brand px-3 py-2 text-black hover:bg-brand-dark disabled:opacity-50"
        >
          <Plus size={16} />
          <span className="ml-2">Adicionar</span>
        </button>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Excluir conta"
        description={pendingDelete ? `Excluir "${pendingDelete.name}"?` : ''}
        confirmLabel="Excluir"
        danger
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteAccount.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
