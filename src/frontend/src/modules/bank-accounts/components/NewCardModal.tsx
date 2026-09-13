'use client';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import type { CardBrand } from '@saldix/shared-types';
import { useCreateCard } from '../hooks/useBankAccounts';

interface NewCardModalProps {
  open: boolean;
  bankAccountId: string;
  onClose: () => void;
}

export function NewCardModal({ open, bankAccountId, onClose }: NewCardModalProps) {
  const [name, setName] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [brand, setBrand] = useState<CardBrand>('visa');
  const [error, setError] = useState<string | null>(null);
  const createCard = useCreateCard(bankAccountId);

  if (!open) return null;

  function resetAndClose() {
    setName('');
    setLastDigits('');
    setBrand('visa');
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createCard.mutateAsync({
        name: name.trim(),
        lastDigits: lastDigits.trim() || undefined,
        brand,
      });
      resetAndClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar o cartão.');
    }
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Novo Cartão</h2>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Nome
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Nubank Roxinho"
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Bandeira
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value as CardBrand)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          >
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="other">Outra</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Últimos 4 dígitos (opcional)
          <input
            value={lastDigits}
            onChange={(e) => setLastDigits(e.target.value)}
            maxLength={4}
            placeholder="1234"
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
            disabled={createCard.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
