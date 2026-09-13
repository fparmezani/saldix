'use client';

import { isShareBasedCategory } from '@saldix/shared-types';
import { formatCurrency, formatPercentage } from '@/shared/lib/formatters';
import { INVESTMENT_CATEGORY_LABELS } from '../constants';
import { useInvestmentsSummary } from '../hooks/useInvestments';

export function InvestmentsSummaryCard() {
  const { data: summary } = useInvestmentsSummary();

  if (!summary) return null;

  const positive = summary.totalGainAmount >= 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-surface-border bg-surface-card p-5">
          <p className="text-xs uppercase text-gray-500">Total investido</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalInvested)}</p>
        </div>
        <div className="rounded-xl2 border border-surface-border bg-surface-card p-5">
          <p className="text-xs uppercase text-gray-500">Valor atual</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(summary.totalCurrent)}</p>
        </div>
        <div className="rounded-xl2 border border-surface-border bg-surface-card p-5">
          <p className="text-xs uppercase text-gray-500">Rentabilidade</p>
          <p className={`text-2xl font-bold ${positive ? 'text-brand-light' : 'text-rose-400'}`}>
            {positive ? '+' : ''}
            {formatCurrency(summary.totalGainAmount)} ({positive ? '+' : ''}
            {formatPercentage(summary.totalGainPercentage)})
          </p>
        </div>
      </div>

      {summary.byCategory.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summary.byCategory.map((entry) => (
            <div
              key={entry.category}
              className="rounded-lg border border-surface-border bg-surface-card p-3 text-sm"
            >
              <p className="text-xs text-gray-500">{INVESTMENT_CATEGORY_LABELS[entry.category]}</p>
              <p className="text-gray-100">{formatCurrency(entry.totalCurrent)}</p>
              {isShareBasedCategory(entry.category) && (
                <p className="text-xs text-gray-500">
                  {formatPercentage(entry.allocatedPercentage)} alocado
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
