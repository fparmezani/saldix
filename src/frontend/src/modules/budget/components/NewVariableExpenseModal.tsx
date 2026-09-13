'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import { useCreateVariableExpense } from '../hooks/useVariableExpenses';
import { CategorySelect } from './CategorySelect';

interface NewVariableExpenseModalProps {
  month: string;
  open: boolean;
  onClose: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function NewVariableExpenseModal({ month, open, onClose }: NewVariableExpenseModalProps) {
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(todayIso);
  const [installmentToggle, setInstallmentToggle] = useState(false);
  const [installments, setInstallments] = useState('2');
  const [error, setError] = useState<string | null>(null);
  const createVariableExpense = useCreateVariableExpense(month);

  if (!open) return null;

  function resetAndClose() {
    setDescription('');
    setAmount('');
    setExpenseDate(todayIso());
    setInstallmentToggle(false);
    setInstallments('2');
    setCategoryId('');
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createVariableExpense.mutateAsync({
        categoryId,
        description: description.trim(),
        amount: Number(amount),
        expenseDate,
        ...(installmentToggle ? { installments: Number(installments) } : {}),
      });
      resetAndClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível adicionar a despesa.');
    }
  }

  const installmentValue = installmentToggle
    ? Number(amount || 0) / Math.max(Number(installments) || 1, 1)
    : null;

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Nova Despesa Variável</h2>

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
            placeholder="ex: Mercado, iFood"
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Valor {installmentToggle ? 'total da compra' : ''}
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
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={installmentToggle}
            onChange={(e) => setInstallmentToggle(e.target.checked)}
            className="h-4 w-4 rounded border-surface-border"
          />
          Parcelado
        </label>

        {installmentToggle && (
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Número de parcelas
            <input
              required
              type="number"
              min="2"
              max="60"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
            />
            {installmentValue !== null && amount && (
              <span className="text-xs text-gray-500">
                {installments}x de R$ {installmentValue.toFixed(2)}
              </span>
            )}
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
            disabled={createVariableExpense.isPending || !categoryId}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
