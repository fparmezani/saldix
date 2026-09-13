'use client';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import type { StatementImportPreview, StatementSourceType } from '@saldix/shared-types';
import { useUploadStatementPreview } from '../hooks/useBankAccounts';

interface StatementUploadModalProps {
  open: boolean;
  bankAccountId: string;
  sourceType: StatementSourceType;
  onClose: () => void;
  onPreviewReady: (preview: StatementImportPreview) => void;
}

const COPY: Record<StatementSourceType, { title: string; description: string }> = {
  card_invoice: {
    title: 'Importar Fatura',
    description:
      'Envie o PDF da fatura do cartão baixado no site/app do banco (não escaneado). O sistema tenta identificar os lançamentos automaticamente — você revisa tudo antes de confirmar.',
  },
  bank_statement: {
    title: 'Importar Extrato',
    description:
      'Envie o PDF do extrato da conta baixado no site/app do banco (não escaneado). O sistema tenta identificar os lançamentos automaticamente — você revisa tudo antes de confirmar.',
  },
};

export function StatementUploadModal({
  open,
  bankAccountId,
  sourceType,
  onClose,
  onPreviewReady,
}: StatementUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadPreview = useUploadStatementPreview(bankAccountId);

  if (!open) return null;

  const copy = COPY[sourceType];

  function resetAndClose() {
    setFile(null);
    setError(null);
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setError(null);
    try {
      const preview = await uploadPreview.mutateAsync({ sourceType, file });
      setFile(null);
      onPreviewReady(preview);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível ler o arquivo.');
    }
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <h2 className="text-lg font-semibold text-white">{copy.title}</h2>
        <p className="text-sm text-gray-400">{copy.description}</p>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-surface-border px-4 py-8 text-center text-sm text-gray-400 hover:border-brand">
          <Upload size={24} />
          {file ? file.name : 'Clique para escolher o PDF'}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
            disabled={!file || uploadPreview.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            {uploadPreview.isPending ? 'Lendo...' : 'Analisar arquivo'}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
