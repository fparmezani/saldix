'use client';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import type { BankAccountType } from '@saldix/shared-types';
import { KNOWN_BANKS, previewBankName } from '../lib/bank-code-directory';
import { useCreateBankAccount } from '../hooks/useBankAccounts';

interface NewBankAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const OTHER_BANK = 'other';

export function NewBankAccountModal({ open, onClose }: NewBankAccountModalProps) {
  const [type, setType] = useState<BankAccountType>('checking');
  const [bankSelection, setBankSelection] = useState('');
  const [manualBankCode, setManualBankCode] = useState('');
  const [agency, setAgency] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createBankAccount = useCreateBankAccount();

  if (!open) return null;

  const isOtherBank = bankSelection === OTHER_BANK;
  const bankCode = isOtherBank ? manualBankCode : bankSelection;
  const bankNamePreview = isOtherBank ? previewBankName(manualBankCode) : null;

  function resetAndClose() {
    setType('checking');
    setBankSelection('');
    setManualBankCode('');
    setAgency('');
    setAccountNumber('');
    setError(null);
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await createBankAccount.mutateAsync({
        type,
        bankCode: bankCode.trim(),
        agency: agency.trim(),
        accountNumber: accountNumber.trim(),
      });
      resetAndClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível criar a conta.');
    }
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">Nova Conta Bancária</h2>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Tipo
          <select
            value={type}
            onChange={(e) => setType(e.target.value as BankAccountType)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          >
            <option value="checking">Conta Bancária</option>
            <option value="investment">Conta de Investimento</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Banco
          <select
            required
            value={bankSelection}
            onChange={(e) => setBankSelection(e.target.value)}
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          >
            <option value="" disabled>
              Selecione seu banco
            </option>
            {KNOWN_BANKS.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
            <option value={OTHER_BANK}>Outro banco (informar código)</option>
          </select>
        </label>

        {isOtherBank && (
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Código do banco
            <input
              required
              value={manualBankCode}
              onChange={(e) => setManualBankCode(e.target.value)}
              placeholder="ex: 260"
              maxLength={3}
              className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
            />
            {bankNamePreview && (
              <span className="text-xs text-brand-light">{bankNamePreview}</span>
            )}
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Agência
          <input
            required
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            placeholder="ex: 0001"
            className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-300">
          Conta
          <input
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="ex: 12345-6"
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
            disabled={createBankAccount.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
