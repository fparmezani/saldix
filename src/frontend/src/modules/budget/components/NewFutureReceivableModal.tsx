'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import type { IncomeType } from '@saldix/shared-types';
import { useCreateFutureReceivable } from '../hooks/useFutureReceivables';

interface NewFutureReceivableModalProps {
  month: string;
  open: boolean;
  onClose: () => void;
}

export function NewFutureReceivableModal({ month, open, onClose }: NewFutureReceivableModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [incomeType, setIncomeType] = useState<IncomeType>('extra');
  const createReceivable = useCreateFutureReceivable(month);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createReceivable.mutateAsync({
      description,
      amount: Number(amount),
      expectedDate,
      incomeType,
    });
    setDescription('');
    setAmount('');
    setExpectedDate('');
    onClose();
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Recebimento Futuro</h2>
        <p className="text-xs text-gray-500">
          Entrada prevista. Não conta na receita até você marcar como recebida.
        </p>

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

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Data prevista
          <input
            required
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Tipo de renda
          <select
            value={incomeType}
            onChange={(e) => setIncomeType(e.target.value as IncomeType)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          >
            <option value="main">Renda Principal</option>
            <option value="extra">Renda Extra</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-surface-border px-4 py-2 text-gray-200 hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createReceivable.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
