'use client';

import { useEffect, useState } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import {
  isShareBasedCategory,
  type InvestmentCategory,
  type InvestmentCategorySummary,
  type InvestmentWithGain,
} from '@saldix/shared-types';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';
import {
  BLANK_INVESTMENT_DRAFT,
  computeGain,
  computeResultValue,
  computeWeightPercentage,
  draftFromInvestment,
  validateInvestmentDraft,
} from '../lib/investment-row-math';
import { useCreateInvestment, useUpdateInvestment } from '../hooks/useInvestments';

interface InvestmentRowProps {
  category: InvestmentCategory;
  investment: InvestmentWithGain | null;
  isEditing: boolean;
  allocation: InvestmentCategorySummary | undefined;
  onStartEdit: (id: string) => void;
  onStopEditing: () => void;
  onDelete: (investment: InvestmentWithGain) => void;
  onError: (message: string | null) => void;
}

function GainBadge({ gainAmount, gainPercentage }: { gainAmount: number; gainPercentage: number }) {
  const positive = gainAmount >= 0;
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive ? 'bg-brand/15 text-brand-light' : 'bg-rose-500/15 text-rose-400'
      }`}
    >
      {positive ? '+' : ''}
      {formatCurrency(gainAmount)} ({positive ? '+' : ''}
      {formatPercentage(gainPercentage)})
    </span>
  );
}

export function InvestmentRow({
  category,
  investment,
  isEditing,
  allocation,
  onStartEdit,
  onStopEditing,
  onDelete,
  onError,
}: InvestmentRowProps) {
  const shareBased = isShareBasedCategory(category);
  const isDisplay = investment !== null && !isEditing;
  const [draft, setDraft] = useState(BLANK_INVESTMENT_DRAFT);
  const createInvestment = useCreateInvestment();
  const updateInvestment = useUpdateInvestment();
  const pending = createInvestment.isPending || updateInvestment.isPending;

  useEffect(() => {
    if (investment && isEditing) setDraft(draftFromInvestment(investment));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, investment?.id]);

  const resultValue = shareBased ? computeResultValue(draft.quantity, draft.marketPricePerUnit) : null;

  useEffect(() => {
    if (resultValue === null || isDisplay) return;
    setDraft((prev) => ({
      ...prev,
      investedAmount: prev.investedAmount === '' ? String(resultValue) : prev.investedAmount,
      currentAmount: prev.currentAmount === '' ? String(resultValue) : prev.currentAmount,
    }));
  }, [resultValue, isDisplay]);

  function updateDraft(patch: Partial<typeof draft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleCancel() {
    onError(null);
    if (investment) onStopEditing();
    else setDraft(BLANK_INVESTMENT_DRAFT);
  }

  async function handleSave() {
    const validationError = validateInvestmentDraft(draft, shareBased);
    if (validationError) {
      onError(validationError);
      return;
    }
    onError(null);

    const shareFields = shareBased
      ? {
          ticker: draft.ticker.trim(),
          quantity: Number(draft.quantity),
          marketPricePerUnit: Number(draft.marketPricePerUnit),
          ...(draft.targetPercentage !== '' ? { targetPercentage: Number(draft.targetPercentage) } : {}),
        }
      : {};

    try {
      if (investment === null) {
        await createInvestment.mutateAsync({
          name: draft.name.trim(),
          category,
          investedAmount: Number(draft.investedAmount),
          currentAmount: Number(draft.currentAmount || draft.investedAmount),
          ...shareFields,
        });
        setDraft(BLANK_INVESTMENT_DRAFT);
      } else {
        await updateInvestment.mutateAsync({
          id: investment.id,
          input: {
            name: draft.name.trim(),
            investedAmount: Number(draft.investedAmount),
            currentAmount: Number(draft.currentAmount || draft.investedAmount),
            ...shareFields,
          },
        });
        onStopEditing();
      }
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : 'Não foi possível salvar o investimento.');
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleSave();
    }
  }

  const cellInputClass = 'w-full rounded border border-surface-border bg-surface px-2 py-1 text-gray-100';

  if (isDisplay) {
    const weight = shareBased ? computeWeightPercentage(investment.currentAmount, allocation?.totalCurrent) : null;

    return (
      <tr className="border-b border-surface-border last:border-0">
        {shareBased && <td className="whitespace-nowrap px-3 py-2 text-gray-100">{investment.ticker}</td>}
        <td className="px-3 py-2 text-gray-100">{investment.name}</td>
        {shareBased && (
          <td className="whitespace-nowrap px-3 py-2 text-gray-300">
            {investment.marketPricePerUnit !== null ? formatCurrency(investment.marketPricePerUnit) : '—'}
          </td>
        )}
        {shareBased && (
          <td className="whitespace-nowrap px-3 py-2 text-gray-300">{investment.quantity ?? '—'}</td>
        )}
        {shareBased && (
          <td className="whitespace-nowrap px-3 py-2 text-gray-300">
            {investment.quantity !== null && investment.marketPricePerUnit !== null
              ? formatCurrency(investment.quantity * investment.marketPricePerUnit)
              : '—'}
          </td>
        )}
        <td className="whitespace-nowrap px-3 py-2 text-gray-300">{formatCurrency(investment.investedAmount)}</td>
        <td className="whitespace-nowrap px-3 py-2 text-gray-100">{formatCurrency(investment.currentAmount)}</td>
        <td className="whitespace-nowrap px-3 py-2">
          <GainBadge gainAmount={investment.gainAmount} gainPercentage={investment.gainPercentage} />
        </td>
        {shareBased && (
          <td className="whitespace-nowrap px-3 py-2 text-gray-300">
            {weight !== null ? formatPercentage(weight) : '—'}
          </td>
        )}
        {shareBased && (
          <td className="whitespace-nowrap px-3 py-2 text-gray-300">
            {investment.targetPercentage !== null ? formatPercentage(investment.targetPercentage) : '—'}
          </td>
        )}
        <td className="whitespace-nowrap px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Atualizar investimento"
              onClick={() => onStartEdit(investment.id)}
              className="text-gray-500 hover:text-brand-light"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              aria-label="Excluir investimento"
              onClick={() => onDelete(investment)}
              className="text-gray-500 hover:text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-surface-border bg-white/5 last:border-0">
      {shareBased && (
        <td className="px-3 py-2">
          <input
            value={draft.ticker}
            onChange={(e) => updateDraft({ ticker: e.target.value.toUpperCase() })}
            onKeyDown={handleKeyDown}
            placeholder="MXRF11"
            className={`${cellInputClass} w-24`}
          />
        </td>
      )}
      <td className="px-3 py-2">
        <input
          value={draft.name}
          onChange={(e) => updateDraft({ name: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="Nome"
          className={`${cellInputClass} min-w-[10rem]`}
        />
      </td>
      {shareBased && (
        <td className="px-3 py-2">
          <CurrencyInput
            min="0"
            value={draft.marketPricePerUnit}
            onValueChange={(v) => updateDraft({ marketPricePerUnit: v })}
            className={`${cellInputClass} w-24`}
          />
        </td>
      )}
      {shareBased && (
        <td className="px-3 py-2">
          <CurrencyInput
            min="0"
            value={draft.quantity}
            onValueChange={(v) => updateDraft({ quantity: v })}
            className={`${cellInputClass} w-20`}
          />
        </td>
      )}
      {shareBased && (
        <td className="whitespace-nowrap px-3 py-2 text-gray-400">
          {resultValue !== null ? formatCurrency(resultValue) : '—'}
        </td>
      )}
      <td className="px-3 py-2">
        <CurrencyInput
          min="0"
          value={draft.investedAmount}
          onValueChange={(v) => updateDraft({ investedAmount: v })}
          className={`${cellInputClass} w-28`}
        />
      </td>
      <td className="px-3 py-2">
        <CurrencyInput
          min="0"
          value={draft.currentAmount}
          onValueChange={(v) => updateDraft({ currentAmount: v })}
          className={`${cellInputClass} w-28`}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-2">
        <GainBadge
          {...computeGain(Number(draft.investedAmount) || 0, Number(draft.currentAmount || draft.investedAmount) || 0)}
        />
      </td>
      {shareBased && <td className="whitespace-nowrap px-3 py-2 text-gray-500">—</td>}
      {shareBased && (
        <td className="px-3 py-2">
          <input
            type="number"
            min={0}
            max={100}
            step="0.01"
            value={draft.targetPercentage}
            onChange={(e) => updateDraft({ targetPercentage: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="%"
            className={`${cellInputClass} w-16`}
          />
        </td>
      )}
      <td className="whitespace-nowrap px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Salvar investimento"
            onClick={() => void handleSave()}
            disabled={pending}
            className="text-gray-500 hover:text-brand-light disabled:opacity-50"
          >
            <Check size={16} />
          </button>
          <button
            type="button"
            aria-label={investment ? 'Cancelar edição' : 'Limpar novo investimento'}
            onClick={handleCancel}
            disabled={pending}
            className="text-gray-500 hover:text-red-400 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
