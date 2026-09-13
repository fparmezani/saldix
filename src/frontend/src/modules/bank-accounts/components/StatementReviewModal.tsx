'use client';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useEffect, useMemo, useState } from 'react';
import { Repeat } from 'lucide-react';
import type { StatementImportPreview, StatementTransactionPreview } from '@saldix/shared-types';
import { useCategories } from '@/modules/budget/hooks/useCategories';
import { useFixedExpenses } from '@/modules/budget/hooks/useFixedExpenses';
import { useVariableExpenses } from '@/modules/budget/hooks/useVariableExpenses';
import { formatCurrency } from '@/shared/lib/formatters';
import { useConfirmStatementImport } from '../hooks/useBankAccounts';

interface StatementReviewModalProps {
  bankAccountId: string;
  preview: StatementImportPreview | null;
  onClose: () => void;
  onConfirmed: () => void;
}

function toReferenceMonth(dateStr: string): string {
  return `${dateStr.slice(0, 7)}-01`;
}

export function StatementReviewModal({
  bankAccountId,
  preview,
  onClose,
  onConfirmed,
}: StatementReviewModalProps) {
  const { data: categories } = useCategories();
  const confirmImport = useConfirmStatementImport(bankAccountId);
  const [cardNames, setCardNames] = useState<Record<number, string>>({});
  const [rows, setRows] = useState<StatementTransactionPreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  const referenceMonth = useMemo(() => {
    const firstDate = preview?.transactions[0]?.expenseDate;
    return toReferenceMonth(firstDate ?? new Date().toISOString().slice(0, 10));
  }, [preview]);

  const { data: candidateFixed } = useFixedExpenses(referenceMonth);
  const { data: candidateVariable } = useVariableExpenses(referenceMonth);

  const linkOptions = useMemo(
    () => [
      ...(candidateFixed ?? []).map((expense) => ({
        type: 'fixed' as const,
        id: expense.id,
        label: `Fixa · ${expense.description} (${formatCurrency(expense.amount)})`,
      })),
      ...(candidateVariable ?? []).map((expense) => ({
        type: 'variable' as const,
        id: expense.id,
        label: `Variável · ${expense.description} (${formatCurrency(expense.amount)})`,
      })),
    ],
    [candidateFixed, candidateVariable],
  );

  useEffect(() => {
    if (preview) {
      setCardNames(
        Object.fromEntries(preview.detectedCards.map((c) => [c.cardIndex, c.suggestedName])),
      );
      setRows(preview.transactions);
      setError(null);
    }
  }, [preview]);

  if (!preview) return null;

  const isBankStatement = preview.sourceType === 'bank_statement';

  function updateRow(lineId: string, patch: Partial<StatementTransactionPreview>) {
    setRows((prev) => prev.map((row) => (row.lineId === lineId ? { ...row, ...patch } : row)));
  }

  function handleLinkChange(lineId: string, value: string) {
    if (!value) {
      updateRow(lineId, { linkToExpenseId: null, linkToExpenseType: null });
      return;
    }
    const [linkType, linkId] = value.split(':');
    updateRow(lineId, {
      linkToExpenseId: linkId,
      linkToExpenseType: linkType as 'fixed' | 'variable',
    });
  }

  async function handleConfirm() {
    setError(null);
    const included = rows.filter((row) => row.include);

    if (included.some((row) => !row.linkToExpenseId && !row.categoryId)) {
      setError(
        'Escolha uma categoria ou vincule a uma despesa existente para todos os lançamentos incluídos antes de confirmar.',
      );
      return;
    }
    if (included.length === 0) {
      setError('Nenhum lançamento incluído. Marque ao menos um ou cancele a importação.');
      return;
    }

    try {
      await confirmImport.mutateAsync({
        sourceType: preview!.sourceType,
        bankAccountId,
        cards: preview!.detectedCards.map((card) => ({
          cardIndex: card.cardIndex,
          name: cardNames[card.cardIndex]?.trim() || card.suggestedName,
          lastDigits: card.lastDigits ?? undefined,
          existingCardId: card.existingCardId,
        })),
        transactions: included.map((row) => ({
          cardIndex: row.cardIndex,
          description: row.description,
          amount: row.amount,
          expenseDate: row.expenseDate,
          installmentNumber: row.installmentNumber,
          installmentTotal: row.installmentTotal,
          categoryId: row.categoryId,
          isRecurring: row.isRecurring,
          linkToExpenseId: row.linkToExpenseId,
          linkToExpenseType: row.linkToExpenseType,
        })),
      });
      onConfirmed();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível confirmar a importação.');
    }
  }

  function renderRow(row: StatementTransactionPreview) {
    const linked = Boolean(row.linkToExpenseId);
    return (
      <tr key={row.lineId} className="border-b border-surface-border last:border-0">
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={row.include}
            onChange={(e) => updateRow(row.lineId, { include: e.target.checked })}
          />
        </td>
        <td className="px-3 py-2">
          <div className="flex items-center gap-1.5">
            <input
              value={row.description}
              onChange={(e) => updateRow(row.lineId, { description: e.target.value })}
              className="w-44 rounded border border-surface-border bg-surface px-2 py-1 text-gray-100"
            />
            {row.installmentNumber && row.installmentTotal && (
              <span
                title={`Vai gerar as parcelas ${row.installmentNumber} a ${row.installmentTotal}`}
                className="flex items-center gap-0.5 whitespace-nowrap text-xs text-brand-light"
              >
                <Repeat size={11} />
                {row.installmentNumber}/{row.installmentTotal}
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-2 text-gray-300">{row.expenseDate}</td>
        <td className="px-3 py-2">
          <input
            type="number"
            step="0.01"
            value={row.amount}
            onChange={(e) => updateRow(row.lineId, { amount: Number(e.target.value) })}
            className="w-24 rounded border border-surface-border bg-surface px-2 py-1 text-gray-100"
          />
        </td>
        <td className="px-3 py-2">
          <select
            value={row.categoryId ?? ''}
            disabled={linked}
            onChange={(e) => updateRow(row.lineId, { categoryId: e.target.value || null })}
            className="rounded border border-surface-border bg-surface px-2 py-1 text-gray-100 disabled:opacity-50"
          >
            <option value="">Selecione</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2">
          <input
            type="checkbox"
            checked={row.isRecurring}
            disabled={linked}
            onChange={(e) => updateRow(row.lineId, { isRecurring: e.target.checked })}
          />
        </td>
        <td className="px-3 py-2">
          <select
            value={row.linkToExpenseId ? `${row.linkToExpenseType}:${row.linkToExpenseId}` : ''}
            onChange={(e) => handleLinkChange(row.lineId, e.target.value)}
            className="max-w-[14rem] rounded border border-surface-border bg-surface px-2 py-1 text-gray-100"
          >
            <option value="">Criar nova despesa</option>
            {linkOptions.map((option) => (
              <option key={`${option.type}:${option.id}`} value={`${option.type}:${option.id}`}>
                {option.label}
              </option>
            ))}
          </select>
        </td>
      </tr>
    );
  }

  const tableHead = (
    <thead>
      <tr className="border-b border-surface-border text-left text-xs uppercase text-gray-500">
        <th className="px-3 py-2">Incluir</th>
        <th className="px-3 py-2">Descrição</th>
        <th className="px-3 py-2">Data</th>
        <th className="px-3 py-2">Valor</th>
        <th className="px-3 py-2">Categoria</th>
        <th className="px-3 py-2">Recorrente</th>
        <th className="px-3 py-2">Vincular a despesa existente</th>
      </tr>
    </thead>
  );

  return (
    <ModalFrame onClose={onClose}>
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col rounded-xl2 border border-surface-border bg-surface-card">
        <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Revisar importação {isBankStatement ? 'do extrato' : 'da fatura'}
            </h2>
            <p className="text-sm text-gray-400">
              Nada é gravado até você confirmar. Corrija, desmarque ou vincule a uma despesa já
              cadastrada antes de confirmar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            Fechar
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto px-6 py-4">
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          {!isBankStatement &&
            preview.detectedCards.map((card) => (
              <div key={card.cardIndex} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase text-gray-500">Cartão</span>
                  <input
                    value={cardNames[card.cardIndex] ?? ''}
                    onChange={(e) =>
                      setCardNames((prev) => ({ ...prev, [card.cardIndex]: e.target.value }))
                    }
                    disabled={card.existingCardId !== null}
                    className="rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-sm text-gray-100 disabled:opacity-60"
                  />
                  {card.existingCardId && (
                    <span className="text-xs text-gray-500">(cartão já cadastrado)</span>
                  )}
                </div>

                <div className="overflow-x-auto rounded-lg border border-surface-border">
                  <table className="w-full text-sm">
                    {tableHead}
                    <tbody>
                      {rows.filter((row) => row.cardIndex === card.cardIndex).map(renderRow)}
                      {rows.filter((row) => row.cardIndex === card.cardIndex).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-3 py-3 text-center text-gray-500">
                            Nenhum lançamento detectado para este cartão.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

          {isBankStatement && (
            <div className="overflow-x-auto rounded-lg border border-surface-border">
              <table className="w-full text-sm">
                {tableHead}
                <tbody>
                  {rows.map(renderRow)}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-3 text-center text-gray-500">
                        Nenhum lançamento detectado neste extrato.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-sm text-gray-400">
            Total a importar:{' '}
            <span className="font-semibold text-gray-100">
              {formatCurrency(rows.filter((r) => r.include).reduce((sum, r) => sum + r.amount, 0))}
            </span>{' '}
            em {rows.filter((r) => r.include).length} lançamento(s)
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-surface-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-surface-border px-4 py-2 text-gray-200 hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirmImport.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            {confirmImport.isPending ? 'Importando...' : 'Confirmar importação'}
          </button>
        </div>
      </div>
    </ModalFrame>
  );
}
