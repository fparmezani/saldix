'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import type { IncomeType } from '@saldix/shared-types';
import { useCreateIncomeSchedule } from '../hooks/useIncomeSchedules';
import { useCreateIncome } from '../hooks/useIncomes';

interface NewIncomeModalProps {
  month: string;
  open: boolean;
  onClose: () => void;
}

export function NewIncomeModal({ month, open, onClose }: NewIncomeModalProps) {
  const [type, setType] = useState<IncomeType>('main');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurrenceDay, setRecurrenceDay] = useState('5');
  const [error, setError] = useState<string | null>(null);
  const createIncome = useCreateIncome(month);
  const createIncomeSchedule = useCreateIncomeSchedule();

  if (!open) return null;

  function resetAndClose() {
    setDescription('');
    setAmount('');
    setRecurring(false);
    setRecurrenceDay('5');
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      if (recurring) {
        await createIncomeSchedule.mutateAsync({
          type,
          description: description.trim(),
          amount: Number(amount),
          recurrenceDay: Number(recurrenceDay),
        });
      } else {
        await createIncome.mutateAsync({
          type,
          description: description.trim(),
          amount: Number(amount),
          referenceMonth: month,
        });
      }
      resetAndClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível adicionar a receita.');
    }
  }

  const isPending = createIncome.isPending || createIncomeSchedule.isPending;

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Nova Receita</h2>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Tipo
          <select
            value={type}
            onChange={(e) => setType(e.target.value as IncomeType)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          >
            <option value="main">Renda Principal</option>
            <option value="extra">Renda Extra</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Descrição
          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

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

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="h-4 w-4 rounded border-surface-border"
          />
          Renda recorrente (repete todo mês)
        </label>

        {recurring && (
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Dia do recebimento
            <input
              required
              type="number"
              min="1"
              max="31"
              value={recurrenceDay}
              onChange={(e) => setRecurrenceDay(e.target.value)}
              className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
            />
            <span className="text-xs text-gray-500">
              Recebe 2x por mês? Cadastre uma renda recorrente para cada dia (ex: dia 1 e dia 15).
            </span>
          </label>
        )}

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
            disabled={isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
