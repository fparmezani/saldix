'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import { useCreateGoal } from '../hooks/useGoals';

interface NewGoalModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewGoalModal({ open, onClose }: NewGoalModalProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createGoal = useCreateGoal();

  if (!open) return null;

  function resetAndClose() {
    setName('');
    setTargetAmount('');
    setTargetDate('');
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createGoal.mutateAsync({
        name: name.trim(),
        targetAmount: Number(targetAmount),
        targetDate,
      });
      resetAndClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar a meta.');
    }
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Nova Meta</h2>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Nome
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Viagem para a neve"
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Valor alvo
          <CurrencyInput
            required

            min="0.01"
            step="0.01"
            value={targetAmount}
            onValueChange={setTargetAmount}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Data alvo
          <input
            required
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
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
            disabled={createGoal.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Criar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
