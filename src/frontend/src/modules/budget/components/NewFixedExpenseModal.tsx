'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import { useCreateFixedExpense } from '../hooks/useFixedExpenses';
import { CategorySelect } from './CategorySelect';

interface NewFixedExpenseModalProps {
  month: string;
  open: boolean;
  onClose: () => void;
}

export function NewFixedExpenseModal({ month, open, onClose }: NewFixedExpenseModalProps) {
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('10');
  const [error, setError] = useState<string | null>(null);
  const createFixedExpense = useCreateFixedExpense(month);

  if (!open) return null;

  function resetAndClose() {
    setDescription('');
    setAmount('');
    setDueDay('10');
    setCategoryId('');
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createFixedExpense.mutateAsync({
        categoryId,
        description: description.trim(),
        amount: Number(amount),
        dueDay: Number(dueDay),
        referenceMonth: month,
      });
      resetAndClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível adicionar a despesa.');
    }
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Nova Despesa Fixa</h2>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Categoria
          <CategorySelect value={categoryId} onChange={setCategoryId} />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Descrição
          <input
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ex: Aluguel"
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

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Dia de vencimento
          <input
            required
            type="number"
            min="1"
            max="31"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
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
            disabled={createFixedExpense.isPending || !categoryId}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
