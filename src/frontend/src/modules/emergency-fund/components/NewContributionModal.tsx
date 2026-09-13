'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import { useAddEmergencyFundContribution } from '../hooks/useEmergencyFund';

interface NewContributionModalProps {
  open: boolean;
  onClose: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function NewContributionModal({ open, onClose }: NewContributionModalProps) {
  const [amount, setAmount] = useState('');
  const [contributedAt, setContributedAt] = useState(todayIso);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const addContribution = useAddEmergencyFundContribution();

  if (!open) return null;

  function resetAndClose() {
    setAmount('');
    setContributedAt(todayIso());
    setNote('');
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await addContribution.mutateAsync({
        amount: Number(amount),
        contributedAt,
        note: note.trim() || undefined,
      });
      resetAndClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível registrar o aporte.');
    }
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Novo Aporte</h2>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Valor
          <CurrencyInput
            required

            min="0.01"
            step="0.01"
            value={amount}
            onValueChange={setAmount}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Data
          <input
            required
            type="date"
            value={contributedAt}
            onChange={(e) => setContributedAt(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Nota (opcional)
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ex: Caixinha Nubank"
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg border border-surface-border px-4 py-2 text-gray-200 hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={addContribution.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
