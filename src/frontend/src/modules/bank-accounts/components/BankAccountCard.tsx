'use client';

import { useState } from 'react';
import { CreditCard, FileText, Landmark, Plus, Upload } from 'lucide-react';
import type { BankAccount, StatementImportPreview, StatementSourceType } from '@saldix/shared-types';
import { useCards } from '../hooks/useBankAccounts';
import { NewCardModal } from './NewCardModal';
import { StatementReviewModal } from './StatementReviewModal';
import { StatementUploadModal } from './StatementUploadModal';

interface BankAccountCardProps {
  account: BankAccount;
}

const BRAND_LABEL: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  other: 'Outra',
};

export function BankAccountCard({ account }: BankAccountCardProps) {
  const isChecking = account.type === 'checking';
  const { data: cards, isLoading } = useCards(isChecking ? account.id : '');
  const [newCardOpen, setNewCardOpen] = useState(false);
  const [uploadSourceType, setUploadSourceType] = useState<StatementSourceType | null>(null);
  const [preview, setPreview] = useState<StatementImportPreview | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Landmark size={24} className="text-brand-light" />
          <div>
            <p className="font-semibold text-white">{account.bankName}</p>
            <p className="text-xs text-gray-500">
              Ag. {account.agency} · Conta {account.accountNumber}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-surface-border px-2.5 py-1 text-xs text-gray-300">
          {isChecking ? 'Conta Bancária' : 'Investimento'}
        </span>
      </div>

      {isChecking && (
        <>
          <div className="flex flex-wrap gap-2 border-t border-surface-border pt-4">
            <button
              type="button"
              onClick={() => setNewCardOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs text-gray-200 hover:border-brand hover:text-brand-light"
            >
              <Plus size={14} />
              Novo cartão
            </button>
            <button
              type="button"
              onClick={() => setUploadSourceType('card_invoice')}
              className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs text-gray-200 hover:border-brand hover:text-brand-light"
            >
              <Upload size={14} />
              Importar fatura
            </button>
            <button
              type="button"
              onClick={() => setUploadSourceType('bank_statement')}
              className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs text-gray-200 hover:border-brand hover:text-brand-light"
            >
              <FileText size={14} />
              Importar extrato
            </button>
          </div>

          {successMessage && (
            <p className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-xs text-brand-light">
              {successMessage}
            </p>
          )}

          {isLoading && <p className="text-xs text-gray-500">Carregando cartões...</p>}

          {cards && cards.length === 0 && (
            <p className="text-xs text-gray-500">Nenhum cartão cadastrado nesta conta ainda.</p>
          )}

          {cards && cards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs"
                >
                  <CreditCard size={14} className="text-brand-light" />
                  <span className="text-gray-100">{card.name}</span>
                  <span className="text-gray-500">{BRAND_LABEL[card.brand] ?? card.brand}</span>
                  {card.lastDigits && <span className="text-gray-500">final {card.lastDigits}</span>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <NewCardModal
        open={newCardOpen}
        bankAccountId={account.id}
        onClose={() => setNewCardOpen(false)}
      />
      <StatementUploadModal
        open={uploadSourceType !== null}
        bankAccountId={account.id}
        sourceType={uploadSourceType ?? 'card_invoice'}
        onClose={() => setUploadSourceType(null)}
        onPreviewReady={(result) => {
          setUploadSourceType(null);
          setPreview(result);
        }}
      />
      <StatementReviewModal
        bankAccountId={account.id}
        preview={preview}
        onClose={() => setPreview(null)}
        onConfirmed={() => {
          setPreview(null);
          setSuccessMessage(
            'Importação concluída. Confira os lançamentos em Orçamento > Despesa Fixa/Variável.',
          );
        }}
      />
    </div>
  );
}
