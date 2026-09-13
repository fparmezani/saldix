'use client';
import { CurrencyInput } from '@/shared/ui/CurrencyInput';
import { ModalFrame } from '@/shared/ui/ModalFrame';

import { useEffect, useState } from 'react';
import { formatCurrency } from '@/shared/lib/formatters';
import { useBudgetSettings, useBudgetSummary, useUpdateBudgetSettings } from '../hooks/useBudget';

const PRESET_PERCENTAGES = [20, 30, 40, 50];

interface InvestAdjustModalProps {
  month: string;
  open: boolean;
  onClose: () => void;
}

export function InvestAdjustModal({ month, open, onClose }: InvestAdjustModalProps) {
  const { data: settings } = useBudgetSettings(month);
  const { data: summary } = useBudgetSummary(month);
  const updateSettings = useUpdateBudgetSettings(month);

  const [mode, setMode] = useState<'percentage' | 'fixed'>('percentage');
  const [percentage, setPercentage] = useState('20');
  const [fixedAmount, setFixedAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings && open) {
      setMode(settings.investMode);
      setPercentage(String(settings.investPercentage ?? 20));
      setFixedAmount(settings.investFixedAmount !== null ? String(settings.investFixedAmount) : '');
    }
  }, [settings, open]);

  if (!open) return null;

  const totalIncome = summary?.totalIncome ?? 0;
  const previewAmount =
    mode === 'percentage'
      ? totalIncome * (Number(percentage || 0) / 100)
      : Number(fixedAmount || 0);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await updateSettings.mutateAsync({
        referenceMonth: month,
        investMode: mode,
        ...(mode === 'percentage'
          ? { investPercentage: Number(percentage) }
          : { investFixedAmount: Number(fixedAmount) }),
      });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.');
    }
  }

  return (
    <ModalFrame onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl2 border border-surface-border bg-surface-card p-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-white">Investir</h2>
          <p className="text-sm text-gray-400">Quanto da sua receita você reserva pra investir.</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('percentage')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
              mode === 'percentage'
                ? 'bg-brand text-black'
                : 'border border-surface-border text-gray-300'
            }`}
          >
            % da receita
          </button>
          <button
            type="button"
            onClick={() => setMode('fixed')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
              mode === 'fixed'
                ? 'bg-brand text-black'
                : 'border border-surface-border text-gray-300'
            }`}
          >
            Valor fixo
          </button>
        </div>

        {mode === 'percentage' ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {PRESET_PERCENTAGES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setPercentage(String(preset))}
                  className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium ${
                    Number(percentage) === preset
                      ? 'bg-brand text-black'
                      : 'border border-surface-border text-gray-300'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
            <label className="flex flex-col gap-1 text-sm text-gray-300">
              Percentual customizado
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
              />
            </label>
          </div>
        ) : (
          <label className="flex flex-col gap-1 text-sm text-gray-300">
            Valor fixo (R$)
            <CurrencyInput
              required

              min="0"
              step="0.01"
              value={fixedAmount}
              onValueChange={setFixedAmount}
              className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-gray-100"
            />
            <span className="text-xs text-gray-500">
              Fica assim mesmo que a receita do mês mude.
            </span>
          </label>
        )}

        <div className="rounded-lg border border-surface-border bg-surface px-4 py-3 text-center">
          <p className="text-xs uppercase text-gray-500">Valor a investir</p>
          <p className="text-xl font-bold text-brand-light">{formatCurrency(previewAmount)}</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

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
            disabled={updateSettings.isPending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-black hover:bg-brand-dark disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
